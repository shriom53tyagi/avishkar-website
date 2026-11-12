#!/usr/bin/env bash
# Activates an uploaded release on the production server.
#
# Run over SSH by .github/workflows/deploy.yml, which first uploads
# release-<sha>.tar.gz and this script to $DEPLOY_PATH/incoming/.
# Nothing is built or installed here (the server has 1 GB of RAM).
#
# Required environment:
#   DEPLOY_PATH         absolute directory holding releases/, shared/ and the "current" symlink
#   ENV_FILE            absolute path of the existing production env file (read, never moved)
#   APP_PORT            port the app listens on (the one nginx proxies to)
#   RELEASE_SHA         full git sha of the release being deployed
#   REQUIRED_NODE_MAJOR minimum Node major version (from .nvmrc)
# Optional:
#   APP_HOST            bind address (default 0.0.0.0, same as `next start`)
#   HEALTH_RETRIES      health check attempts (default 30)
#   HEALTH_INTERVAL     seconds between attempts (default 2)
set -euo pipefail

APP_NAME="avishkar"
KEEP_RELEASES=3
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-2}"

log() { printf '[deploy] %s\n' "$*"; }
die() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

: "${DEPLOY_PATH:?DEPLOY_PATH is not set}"
: "${ENV_FILE:?ENV_FILE is not set}"
: "${APP_PORT:?APP_PORT is not set}"
: "${RELEASE_SHA:?RELEASE_SHA is not set}"
: "${REQUIRED_NODE_MAJOR:?REQUIRED_NODE_MAJOR is not set}"
[[ "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]] || die "RELEASE_SHA is not a full git sha"
[[ "$DEPLOY_PATH" == /* ]] || die "DEPLOY_PATH must be absolute"
[[ "$ENV_FILE" == /* ]] || die "ENV_FILE must be absolute"
[[ "$APP_PORT" =~ ^[0-9]+$ ]] || die "APP_PORT must be a number"

# Non-interactive SSH sessions do not load nvm; the old deploy relied on it too.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  set +u
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1 || true
  set -u
fi

for cmd in node pm2 curl flock tar; do
  command -v "$cmd" >/dev/null 2>&1 || die "'$cmd' not found in PATH for this SSH session (PATH=$PATH)"
done
node_major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$node_major" -ge "$REQUIRED_NODE_MAJOR" ] \
  || die "server Node is v$(node -v | tr -d v), the build needs >= $REQUIRED_NODE_MAJOR"
[ -r "$ENV_FILE" ] || die "env file '$ENV_FILE' is missing or not readable"

RELEASES="$DEPLOY_PATH/releases"
CURRENT="$DEPLOY_PATH/current"
TARBALL="$DEPLOY_PATH/incoming/release-${RELEASE_SHA}.tar.gz"
REL_ID="$(date -u +%Y%m%d%H%M%S)-${RELEASE_SHA:0:7}"
STAGING="$RELEASES/.$REL_ID.partial"
NEW="$RELEASES/$REL_ID"

[ -f "$TARBALL" ] || die "release tarball not found: $TARBALL"
mkdir -p "$RELEASES" "$DEPLOY_PATH/shared"
[ ! -e "$CURRENT" ] || [ -L "$CURRENT" ] || die "'$CURRENT' exists and is not a symlink"

exec 9>"$DEPLOY_PATH/.deploy.lock"
flock -n 9 || die "another deploy is already running"

# shellcheck disable=SC2329  # invoked through the EXIT trap
cleanup() { rm -f -- "$TARBALL"; rm -rf -- "$STAGING"; }
trap cleanup EXIT

# Loads KEY=VALUE lines like dotenv does (what `next start` did before), without
# executing the file: an unquoted '&' in a URL would break a plain `source`.
# Not supported: multi-line values and $VAR expansion.
load_env_file() {
  local line key val
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"
    line="${line#"${line%%[![:space:]]*}"}"
    case "$line" in '' | '#'*) continue ;; esac
    line="${line#export }"
    key="${line%%=*}"
    val="${line#*=}"
    [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || continue
    if [[ "$val" =~ ^\"(.*)\"[[:space:]]*$ ]] || [[ "$val" =~ ^\'(.*)\'[[:space:]]*$ ]]; then
      val="${BASH_REMATCH[1]}"
    else
      val="$(printf '%s' "$val" | sed -E 's/[[:space:]]+#.*$//; s/[[:space:]]+$//')"
    fi
    export "$key=$val"
  done <"$1"
}

PREV=""
if [ -L "$CURRENT" ]; then PREV="$(readlink -f "$CURRENT")"; fi

# First deploy only: remember how the old, pre-artifact process was started so a
# failed first deploy can bring it back. Paths and args only, no environment.
LEGACY=""
if [ -z "$PREV" ] && pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  LEGACY="$(pm2 jlist 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", d => (s += d)).on("end", () => {
      try {
        const p = JSON.parse(s.slice(s.indexOf("["))).find(x => x.name === "'"$APP_NAME"'");
        const e = p.pm2_env;
        console.log(JSON.stringify({ script: e.pm_exec_path, cwd: e.pm_cwd, args: e.args || [], interpreter: e.exec_interpreter }));
      } catch (_) {}
    });' || true)"
fi

log "extracting release $REL_ID"
rm -rf -- "$STAGING"
mkdir -p "$STAGING"
tar -xzf "$TARBALL" -C "$STAGING"
[ -f "$STAGING/server.js" ] || die "tarball has no server.js; refusing to deploy"
[ -f "$STAGING/ecosystem.config.cjs" ] || die "tarball has no ecosystem.config.cjs; refusing to deploy"
mv "$STAGING" "$NEW"

load_env_file "$ENV_FILE"
export APP_PORT APP_CURRENT_DIR="$CURRENT"
[ -z "${APP_HOST:-}" ] || export APP_HOST

# Points "current" at a release and (re)starts the single PM2 process from it.
# Fork mode restarts cannot be zero-downtime, so delete + start is used: it also
# guarantees the new cwd, script and environment are the ones PM2 uses.
activate() {
  local dir="$1"
  ln -sfn "$dir" "$CURRENT.tmp" || return 1
  mv -Tf "$CURRENT.tmp" "$CURRENT" || return 1
  pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
  pm2 start "$CURRENT/ecosystem.config.cjs" --update-env >/dev/null || return 1
}

health_check() {
  local i
  for ((i = 1; i <= HEALTH_RETRIES; i++)); do
    if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:${APP_PORT}/" 2>/dev/null; then
      return 0
    fi
    sleep "$HEALTH_INTERVAL"
  done
  return 1
}

# Release ids are generated above (digits, dash, hex), so parsing ls is safe.
# shellcheck disable=SC2012
prune() {
  local keep=0 r cur
  cur="$(readlink -f "$CURRENT")"
  while IFS= read -r r; do
    keep=$((keep + 1))
    [ "$keep" -le "$KEEP_RELEASES" ] && continue
    [ "$RELEASES/$r" = "$cur" ] && continue
    log "removing old release $r"
    rm -rf -- "${RELEASES:?}/$r"
  done < <(ls -1 "$RELEASES" | sort -r)
}

log "activating $REL_ID (previous: ${PREV:-none})"
if activate "$NEW" && health_check; then
  pm2 save >/dev/null
  prune
  log "release $REL_ID is live on port $APP_PORT"
  exit 0
fi

printf '[deploy] ERROR: release %s failed to start or did not answer on port %s. Check: pm2 logs %s\n' \
  "$REL_ID" "$APP_PORT" "$APP_NAME" >&2

if [ -n "$PREV" ] && [ -d "$PREV" ]; then
  log "rolling back to $PREV"
  if activate "$PREV" && health_check; then
    pm2 save >/dev/null
    rm -rf -- "$NEW"
    die "rolled back to the previous release; this deploy FAILED"
  fi
  die "rollback to $PREV also failed; the site may be down. Investigate on the server now"
fi

# No previous release: this was the first deploy from the old git checkout.
rm -f -- "$CURRENT"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
if [ -n "$LEGACY" ]; then
  log "restoring the old process"
  restore_cmd="$(node -e '
    const o = JSON.parse(process.argv[1]);
    const q = s => "\x27" + String(s).replace(/\x27/g, "\x27\\\x27\x27") + "\x27";
    let c = "pm2 start " + q(o.script) + " --name '"$APP_NAME"' --cwd " + q(o.cwd);
    if (o.interpreter && o.interpreter !== "none") c += " --interpreter " + q(o.interpreter);
    if (o.args.length) c += " -- " + o.args.map(q).join(" ");
    console.log(c);' "$LEGACY")"
  if (cd / && eval "$restore_cmd" >/dev/null 2>&1); then
    rm -rf -- "$NEW"
    die "first deploy failed; the old process was restarted. Nothing was saved to PM2"
  fi
  die "first deploy failed and the old process could not be restarted automatically. Run: $restore_cmd"
fi
die "first deploy failed and no previous process was found"
