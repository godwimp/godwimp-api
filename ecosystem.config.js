module.exports = {
  apps: [{
    name: 'godwimp-api',
    script: 'dist/src/main.js',
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};