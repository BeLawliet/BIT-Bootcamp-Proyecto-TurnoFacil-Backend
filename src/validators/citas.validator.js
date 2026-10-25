import {
  body,
  param,
  query,
  validationResult,
} from 'express-validator';

import {
  FECHA_REGEX,
  HORA_REGEX,
  esFechaCalendarioValida,
  esFechaActualOFutura,
  esHorarioReservable,
} from '../config/horarios.js';
import { sendResponse } from '../utils/sendResponse.js';

const camposPermitidos = new Set(['servicioId', 'fecha', 'hora', 'notas']);
const parametrosDisponibilidadPermitidos = new Set(['fecha']);

export const validarCita = [
  body('servicioId')
    .isString().withMessage('El servicio es obligatorio.')
    .bail()
    .isMongoId().withMessage('El identificador del servicio no es válido.'),
  body('fecha')
    .isString().withMessage('La fecha es obligatoria.')
    .bail()
    .matches(FECHA_REGEX).withMessage('La fecha debe tener el formato YYYY-MM-DD.')
    .bail()
    .custom(esFechaCalendarioValida)
    .withMessage('La fecha no representa un día válido del calendario.'),
  body('hora')
    .isString().withMessage('La hora es obligatoria.')
    .bail()
    .matches(HORA_REGEX).withMessage('La hora debe tener el formato HH:mm.'),
  body('notas')
    .optional()
    .isString().withMessage('Las notas deben ser una cadena de texto.')
    .bail()
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden superar 500 caracteres.'),
];

export const validarDisponibilidad = [
  query('fecha')
    .isString().withMessage('La fecha es obligatoria.')
    .bail()
    .matches(FECHA_REGEX).withMessage('La fecha debe tener el formato YYYY-MM-DD.')
    .bail()
    .custom(esFechaCalendarioValida)
    .withMessage('La fecha no representa un día válido del calendario.')
    .bail()
    .custom((fecha) => esFechaActualOFutura(fecha))
    .withMessage('La fecha debe corresponder al día actual o a una fecha futura.'),
];

export const validarIdCita = [
  param('id')
    .isMongoId().withMessage('El identificador de la reserva no es válido.'),
];

export function validarSolicitudCita(request, response, next) {
  const bodyData = request.body;
  const camposDesconocidos = !bodyData
    || typeof bodyData !== 'object'
    || Array.isArray(bodyData)
    ? ['body']
    : Object.keys(bodyData).filter((campo) => !camposPermitidos.has(campo));
  const errores = validationResult(request);

  if (camposDesconocidos.length > 0 || !errores.isEmpty()) {
    return sendResponse(response, 400, 'Los datos proporcionados no son válidos');
  }

  if (!esHorarioReservable(request.body.fecha, request.body.hora)) {
    return sendResponse(response, 400, 'El horario seleccionado no está disponible para reservas');
  }

  return next();
}

export function validarSolicitudIdCita(request, response, next) {
  if (!validationResult(request).isEmpty()) {
    return sendResponse(response, 400, 'Los datos proporcionados no son válidos');
  }

  return next();
}

export function validarSolicitudDisponibilidad(request, response, next) {
  const parametrosDesconocidos = Object.keys(request.query)
    .some((parametro) => !parametrosDisponibilidadPermitidos.has(parametro));

  if (parametrosDesconocidos || !validationResult(request).isEmpty()) {
    return sendResponse(response, 400, 'Los datos proporcionados no son válidos');
  }

  return next();
}
