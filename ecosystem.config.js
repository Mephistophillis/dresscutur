module.exports = {
  apps: [
    {
      name: 'dresscutur-prod',
      script: 'npm',
      args: 'start',
      cwd: '/home/meph/Projects/dresscutur',
      instances: 2, // Используем cluster mode для Next.js
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
      watch: false, // Отключаем для production
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
        interval: 30000, // 30 секунд
        timeout: 5000,
        max_failures: 3,
        endpoint: 'http://localhost:3000/api/health'
      }
    },
    
    {
      name: 'dresscutur-staging',
      script: 'npm',
      args: 'start',
      cwd: '/home/meph/Projects/dresscutur',
      instances: 1, // Один инстанс для staging
      exec_mode: 'cluster',
      
      env: {
        NODE_ENV: 'staging',
        PORT: 3001,
        DATABASE_URL: process.env.DATABASE_URL_STAGING,
        REDIS_URL: process.env.REDIS_URL_STAGING,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET_STAGING,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL_STAGING,
      },
      
      max_restarts: 5,
      min_uptime: '3s',
      max_memory_restart: '512M',
      restart_delay: 3000,
      
      log_file: './logs/dresscutur-staging-combined.log',
      out_file: './logs/dresscutur-staging-out.log',
      error_file: './logs/dresscutur-staging-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 8000,
      
      node_args: '--max-old-space-size=1024',
    },
    
    {
      name: 'dresscutur-dev',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/meph/Projects/dresscutur',
      instances: 1,
      exec_mode: 'fork', // Fork mode для разработки
      
      env: {
        NODE_ENV: 'development',
        PORT: 3002,
        DATABASE_URL: process.env.DATABASE_URL_DEV,
        REDIS_URL: process.env.REDIS_URL_DEV,
      },
      
      max_restarts: 3,
      min_uptime: '2s',
      max_memory_restart: '1G',
      restart_delay: 2000,
      
      log_file: './logs/dresscutur-dev-combined.log',
      out_file: './logs/dresscutur-dev-out.log',
      error_file: './logs/dresscutur-dev-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      autorestart: true,
      watch: true, // Включаем watch для разработки
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'logs', '.next', 'public'],
      
      kill_timeout: 2000,
      node_args: '--max-old-space-size=1024',
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
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    },
    
    staging: {
      user: 'meph',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/dresscutur.git',
      path: '/var/www/dresscutur-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
}; 