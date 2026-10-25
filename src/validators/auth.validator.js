import { body, validationResult } from 'express-validator';

import { sendResponse } from '../utils/sendResponse.js';

const camposPermitidos = new Set(['nombre', 'correo', 'password', 'telefono']);
const camposLoginPermitidos = new Set(['correo', 'password']);
const telefonoColombianoRegex = /^3\d{9}$/;

export const validarRegistro = [
  body('nombre')
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres.'),
  body('correo')
    .isString().withMessage('El correo debe ser una cadena de texto.')
    .bail()
    .trim()
    .toLowerCase()
    .isEmail().withMessage('El correo electrónico no tiene un formato válido.'),
  body('password')
    .isString().withMessage('La contraseña debe ser una cadena de texto.')
    .bail()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres.')
    .bail()
    .matches(/[A-Z]/).withMessage('La contraseña debe incluir una letra mayúscula.')
    .matches(/[a-z]/).withMessage('La contraseña debe incluir una letra minúscula.')
    .matches(/\d/).withMessage('La contraseña debe incluir un número.')
    .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe incluir un carácter especial.'),
  body('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser una cadena de texto.')
    .bail()
    .trim()
    .matches(telefonoColombianoRegex)
    .withMessage('El teléfono debe ser un número colombiano de 10 dígitos.'),
];

export const validarLogin = [
  body('correo')
    .isString().withMessage('El correo debe ser una cadena de texto.')
    .bail()
    .trim()
    .toLowerCase()
    .isEmail().withMessage('El correo electrónico no tiene un formato válido.'),
  body('password')
    .isString().withMessage('La contraseña debe ser una cadena de texto.')
    .bail()
    .notEmpty().withMessage('La contraseña es obligatoria.'),
];

function validarSolicitud(request, response, next, camposPermitidosSolicitud) {
  const bodyData = request.body;
  const camposDesconocidos = !bodyData
    || typeof bodyData !== 'object'
    || Array.isArray(bodyData)
    ? ['body']
    : Object.keys(bodyData).filter((campo) => !camposPermitidosSolicitud.has(campo));
  const errores = validationResult(request);

  if (camposDesconocidos.length > 0 || !errores.isEmpty()) {
    return sendResponse(response, 400, 'Los datos proporcionados no son válidos');
  }

  return next();
}

export function validarSolicitudRegistro(request, response, next) {
  return validarSolicitud(request, response, next, camposPermitidos);
}

export function validarSolicitudLogin(request, response, next) {
  return validarSolicitud(request, response, next, camposLoginPermitidos);
}
