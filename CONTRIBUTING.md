# Contributing

## Setup

```bash
nvm use            # Node 22, from .nvmrc
npm ci
cp .env.example .env.local   # then fill in the values you need
npm run dev
```

Ask the project lead for shared development credentials. Never commit `.env` files or secrets.

## Workflow

1. Branch from `main`: `git switch -c feat/short-description`.
2. Commit small, focused changes. A pre-commit hook formats and lints the files you staged.
3. Run `npm run check` before pushing. It runs lint, type checking and the format check.
4. Open a pull request into `main` and fill in the template. CI must pass.
5. The project lead reviews and merges. Direct pushes to `main` are blocked.

## Checks

| Command                | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | TypeScript, no emit               |
| `npm run format`       | Rewrite files with Prettier       |
| `npm run format:check` | Fail if any file is not formatted |
| `npm run check`        | Lint, typecheck and format check  |

Please do not bypass the hooks with `--no-verify`. CI runs the same checks and will fail the PR.
