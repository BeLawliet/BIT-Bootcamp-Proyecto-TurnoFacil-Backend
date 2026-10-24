import { sendResponse } from '../utils/sendResponse.js';

export function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error.status === 400) {
    return sendResponse(response, 400, 'Solicitud inválida');
  }

  console.error('Error interno del servidor:', error);
  return sendResponse(response, 500, 'Error interno del servidor');
}
