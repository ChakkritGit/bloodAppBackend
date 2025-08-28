// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'blood_app_backend',
      script: 'dist/index.js',
      interpreter: 'node',
      exec_mode: 'cluster',
      instances: 'max',

      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      env: {}
    }
  ]
}

// pm2 install pm2-logrotate

// pm2 set pm2-logrotate:retain 30
// pm2 set pm2-logrotate:compress true
// pm2 set pm2-logrotate:dateFormat YYYY-MM-DD
// pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

// pm2 conf
