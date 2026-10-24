import Cita from '../models/Cita.js';
import Servicio from '../models/Servicio.js';
import { sendResponse } from '../utils/sendResponse.js';

function esConflictoDeHorario(error) {
  if (error?.code !== 11000) return false;

  const keyPattern = error.keyPattern ?? {};
  return error.indexName === 'horario_activo_unico'
    || error.index === 'horario_activo_unico'
    || (keyPattern.fecha === 1 && keyPattern.hora === 1);
}

function respuestaPublica(cita, servicio) {
  return {
    id: cita._id.toString(),
    servicio: {
      id: servicio._id.toString(),
      nombre: servicio.nombre,
    },
    fecha: cita.fecha,
    hora: cita.hora,
    estado: cita.estado,
    precioReservado: cita.precioReservado,
    notas: cita.notas ?? null,
  };
}

export async function crearCita(request, response, next) {
  const {
    servicioId,
    fecha,
    hora,
    notas,
  } = request.body;

  try {
    const servicio = await Servicio.findById(servicioId)
      .select('nombre precio activo');

    if (!servicio) {
      return sendResponse(response, 404, 'Servicio no encontrado');
    }

    if (!servicio.activo) {
      return sendResponse(response, 400, 'El servicio seleccionado no está disponible');
    }

    const cita = await Cita.create({
      usuarioId: request.usuario.id,
      servicioId,
      fecha,
      hora,
      estado: 'activa',
      precioReservado: servicio.precio,
      notas: notas || null,
    });

    return sendResponse(
      response,
      201,
      'Reserva creada correctamente',
      respuestaPublica(cita, servicio),
    );
  } catch (error) {
    if (esConflictoDeHorario(error)) {
      return sendResponse(response, 409, 'El horario seleccionado ya está reservado');
    }

    return next(error);
  }
}
