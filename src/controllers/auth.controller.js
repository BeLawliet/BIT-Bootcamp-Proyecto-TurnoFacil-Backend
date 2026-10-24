import bcrypt from 'bcrypt';

import Usuario from '../models/Usuario.js';
import { sendResponse } from '../utils/sendResponse.js';
import { crearTokenAcceso, obtenerConfiguracionJwt } from '../utils/jwt.js';

const BCRYPT_COST = 10;

function respuestaPublica(usuario) {
  return {
    id: usuario._id.toString(),
    nombre: usuario.nombre,
    correo: usuario.correo,
    telefono: usuario.telefono ?? null,
  };
}

export async function registrarUsuario(request, response, next) {
  const { nombre, correo, password, telefono } = request.body;
  const correoNormalizado = correo.trim().toLowerCase();

  try {
    const usuarioExistente = await Usuario.exists({ correo: correoNormalizado });

    if (usuarioExistente) {
      return sendResponse(response, 409, 'El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const usuario = await Usuario.create({
      nombre,
      correo: correoNormalizado,
      passwordHash,
      telefono,
    });

    return sendResponse(
      response,
      201,
      'Usuario registrado correctamente',
      respuestaPublica(usuario),
    );
  } catch (error) {
    if (error?.code === 11000) {
      return sendResponse(response, 409, 'El correo electrónico ya está registrado');
    }

    return next(error);
  }
}

export async function iniciarSesion(request, response, next) {
  const { correo, password } = request.body;
  const correoNormalizado = correo.trim().toLowerCase();

  try {
    const usuario = await Usuario.findOne({ correo: correoNormalizado }).select('+passwordHash');

    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      return sendResponse(response, 401, 'Correo o contraseña incorrectos');
    }

    const { token, expiresIn } = crearTokenAcceso(usuario._id);
    return sendResponse(response, 200, 'Inicio de sesión exitoso', {
      token,
      tokenType: 'Bearer',
      expiresIn,
      usuario: respuestaPublica(usuario),
    });
  } catch (error) {
    return next(error);
  }
}
