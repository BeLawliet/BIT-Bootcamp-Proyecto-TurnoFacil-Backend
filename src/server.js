import 'dotenv/config';
import process from 'node:process';

import mongoose from 'mongoose';

import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { validarConfiguracionJwt } from './utils/jwt.js';

const port = Number(process.env.PORT ?? '3000');

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    return true;
  } catch {
    console.error('No se pudo cerrar la conexión con MongoDB.');
    return false;
  }
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT debe ser un entero entre 1 y 65535.');
  process.exitCode = 1;
} else {
  try {
    validarConfiguracionJwt();
    await connectToDatabase();

    const server = app.listen(port, () => {
      console.log(`TurnoFácil Backend escuchando en el puerto ${port}`);
    });

    server.once('error', async () => {
      console.error('No se pudo iniciar el servidor HTTP.');
      await disconnectFromDatabase();
      process.exitCode = 1;
    });

    async function shutdown(signal) {
      console.log(`${signal} recibido; cerrando el servidor.`);
      let exitCode = 0;

      try {
        await new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        });
      } catch {
        console.error('No se pudo cerrar el servidor HTTP.');
        exitCode = 1;
      }

      if (!(await disconnectFromDatabase())) exitCode = 1;

      process.exitCode = exitCode;
    }

    process.once('SIGINT', () => void shutdown('SIGINT'));
    process.once('SIGTERM', () => void shutdown('SIGTERM'));
  } catch (error) {
    if (error?.code === 'JWT_CONFIG_INVALID') {
      console.error('La configuración JWT es inválida; el servidor no se inició.');
    } else {
      console.error('No se pudo conectar a MongoDB; el servidor no se inició.');
    }
    await disconnectFromDatabase();
    process.exitCode = 1;
  }
}
