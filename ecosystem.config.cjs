// PM2 process definition for the production server.
//
// Fork mode with exactly ONE instance, on purpose. Next's ISR cache lives on
// the local disk of each process, and revalidatePath() only invalidates the
// process that handled the request. Cluster mode or more instances would
// serve stale Insights pages. Do not change this without changing the cache.
//
// scripts/remote-deploy.sh sets APP_PORT, APP_HOST and APP_CURRENT_DIR.
module.exports = {
  apps: [
    {
      name: "avishkar",
      script: "server.js",
      // The "current" symlink, so the saved PM2 process list survives releases
      // being pruned. Falls back to this file's directory outside the deploy.
      cwd: process.env.APP_CURRENT_DIR || __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT || "3000",
        HOSTNAME: process.env.APP_HOST || "0.0.0.0",
      },
    },
  ],
};
