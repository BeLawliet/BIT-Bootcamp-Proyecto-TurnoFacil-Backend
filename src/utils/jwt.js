import jwt from 'jsonwebtoken';

const JWT_ALGORITHM = 'HS256';
const MINIMUM_SECRET_LENGTH = 32;
const SECRETOS_DEBILES = new Set([
  'secret',
  'changeme',
  'jwt_secret',
  'your-secret',
  'your-secret-key',
]);

function errorConfiguracionJwt() {
  return Object.assign(new Error('Configuración JWT inválida.'), {
    code: 'JWT_CONFIG_INVALID',
  });
}

export function obtenerConfiguracionJwt() {
  const secret = process.env.JWT_SECRET?.trim();
  const expiresIn = process.env.JWT_EXPIRES_IN?.trim();

  if (
    !secret
    || secret.length < MINIMUM_SECRET_LENGTH
    || SECRETOS_DEBILES.has(secret.toLowerCase())
    || !expiresIn
  ) {
    throw errorConfiguracionJwt();
  }

  try {
    jwt.sign({}, secret, { algorithm: JWT_ALGORITHM, expiresIn });
  } catch {
    throw errorConfiguracionJwt();
  }

  return { secret, expiresIn, algorithm: JWT_ALGORITHM };
}

export function validarConfiguracionJwt() {
  obtenerConfiguracionJwt();
}

export function crearTokenAcceso(usuarioId) {
  const configuracion = obtenerConfiguracionJwt();
  const token = jwt.sign(
    {},
    configuracion.secret,
    {
      algorithm: configuracion.algorithm,
      subject: usuarioId.toString(),
      expiresIn: configuracion.expiresIn,
    },
  );

  return { token, expiresIn: configuracion.expiresIn };
}
