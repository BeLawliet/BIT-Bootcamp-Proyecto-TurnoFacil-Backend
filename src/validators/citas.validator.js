import { body, param, validationResult } from 'express-validator';

import { sendResponse } from '../utils/sendResponse.js';

const camposPermitidos = new Set(['servicioId', 'fecha', 'hora', 'notas']);
const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
const horaRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function esFechaCalendarioValida(value) {
  if (typeof value !== 'string' || !fechaRegex.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  const diasDelMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const esBisiesto = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (month === 2 && esBisiesto) diasDelMes[1] = 29;

  return day <= diasDelMes[month - 1];
}

function obtenerFechaHoraBogota() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date())
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );

  return {
    fecha: `${parts.year}-${parts.month}-${parts.day}`,
    hora: `${parts.hour}:${parts.minute}`,
  };
}

function esFechaHoraFutura(fecha, hora) {
  const actual = obtenerFechaHoraBogota();
  return fecha > actual.fecha || (fecha === actual.fecha && hora > actual.hora);
}

export const validarCita = [
  body('servicioId')
    .isString().withMessage('El servicio es obligatorio.')
    .bail()
    .isMongoId().withMessage('El identificador del servicio no es válido.'),
  body('fecha')
    .isString().withMessage('La fecha es obligatoria.')
    .bail()
    .matches(fechaRegex).withMessage('La fecha debe tener el formato YYYY-MM-DD.')
    .bail()
    .custom(esFechaCalendarioValida)
    .withMessage('La fecha no representa un día válido del calendario.'),
  body('hora')
    .isString().withMessage('La hora es obligatoria.')
    .bail()
    .matches(horaRegex).withMessage('La hora debe tener el formato HH:mm.'),
  body('notas')
    .optional()
    .isString().withMessage('Las notas deben ser una cadena de texto.')
    .bail()
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden superar 500 caracteres.'),
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

  if (!esFechaHoraFutura(request.body.fecha, request.body.hora)) {
    return sendResponse(response, 400, 'Los datos proporcionados no son válidos');
  }

  return next();
}

export function validarSolicitudIdCita(request, response, next) {
  if (!validationResult(request).isEmpty()) {
    return sendResponse(response, 400, 'Los datos proporcionados no son válidos');
  }

  return next();
}
