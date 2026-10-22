import process from 'node:process';

import app from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT debe ser un entero entre 1 y 65535.');
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`TurnoFácil Backend escuchando en el puerto ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} recibido; cerrando el servidor.`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
