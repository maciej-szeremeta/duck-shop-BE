module.exports = {
  apps: [
    {
      name: 'my-app',
      script: './dist/index.js',
      autorestart: true,
      max_memory_restart: '2G',
      exec_mode: 'cluster',
      // instace:"max"//maksymalna ilość instancji
      // instace:1// 1 instancja
      instaces: -1, // max -1
    },
  ],
};
