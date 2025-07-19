module.exports = {
  apps: [
    {
      name: 'dresscutur',
      script: 'npm',
      args: 'start',
      cwd: '/home/meph/Projects/dresscutur',
      instances: 2,
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      },
      
      // Restart policy
      max_restarts: 10,
      min_uptime: '5s',
      max_memory_restart: '1G',
      restart_delay: 5000,
      
      // Logging
      log_file: './logs/dresscutur-combined.log',
      out_file: './logs/dresscutur-out.log',
      error_file: './logs/dresscutur-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Monitoring
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Performance
      node_args: '--max-old-space-size=2048',
      
      // Health check
      health_check: {
        enabled: true,
        interval: 30000,
        timeout: 5000,
        max_failures: 3,
        endpoint: 'http://localhost:3000/api/health'
      }
    }
  ],
  
  deploy: {
    production: {
      user: 'meph',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/dresscutur.git',
      path: '/var/www/dresscutur',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
}; 