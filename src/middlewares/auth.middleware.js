import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Usuario from '../models/Usuario.js';
import { sendResponse } from '../utils/sendResponse.js';
import { obtenerConfiguracionJwt } from '../utils/jwt.js';

function responderNoAutorizado(response) {
  return sendResponse(response, 401, 'No autorizado');
}

export async function autenticarUsuario(request, response, next) {
  const authorization = request.get('authorization');

  if (typeof authorization !== 'string') {
    return responderNoAutorizado(response);
  }

  const partes = authorization.trim().split(/\s+/);
  if (partes.length !== 2 || partes[0].toLowerCase() !== 'bearer' || !partes[1]) {
    return responderNoAutorizado(response);
  }

  let payload;

  try {
    const configuracion = obtenerConfiguracionJwt();
    payload = jwt.verify(partes[1], configuracion.secret, {
      algorithms: [configuracion.algorithm],
    });
  } catch (error) {
    if (error?.code === 'JWT_CONFIG_INVALID') {
      return next(error);
    }

    return responderNoAutorizado(response);
  }

  if (
    typeof payload !== 'object'
    || payload === null
    || typeof payload.sub !== 'string'
    || !mongoose.isObjectIdOrHexString(payload.sub)
  ) {
    return responderNoAutorizado(response);
  }

  try {
    const usuario = await Usuario.findById(payload.sub).select('nombre correo telefono');

    if (!usuario) {
      return responderNoAutorizado(response);
    }

    request.usuario = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono ?? null,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
