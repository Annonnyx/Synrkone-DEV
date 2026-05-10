// PM2 ecosystem for Synkrone client bots.
//
// Each bot is its own PM2 app, but they ALL share the same Python venv at
// /Partage/Synkrone/.venv/ — never create a venv per bot.
//
// Deploy on the VPS as: /var/www/synkrone/ecosystem.config.js
// (the `new_bot.sh` script appends new entries here automatically).
module.exports = {
  apps: [
    {
      name: "synkrone_client_example",
      cwd: "/bots/client_example",
      script: "/bots/client_example/main.py",
      interpreter: "/Partage/Synkrone/.venv/bin/python",
      args: "",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "30s",
      restart_delay: 5000,
      kill_timeout: 8000,
      env: {
        PYTHONUNBUFFERED: "1",
        SYNKRONE_SHARED_ROOT: "/Partage/Synkrone",
      },
      out_file: "/var/log/synkrone/client_example.out.log",
      error_file: "/var/log/synkrone/client_example.err.log",
      merge_logs: true,
      time: true,
    },
  ],
};
