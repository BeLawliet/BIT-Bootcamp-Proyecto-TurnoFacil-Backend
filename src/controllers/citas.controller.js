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

function fechaEnFormatoIso(fecha) {
  return fecha ? new Date(fecha).toISOString() : null;
}

function respuestaPublicaDeConsulta(cita) {
  const servicio = cita.servicioId && typeof cita.servicioId.nombre === 'string'
    ? {
      id: cita.servicioId._id.toString(),
      nombre: cita.servicioId.nombre,
    }
    : null;

  return {
    id: cita._id.toString(),
    servicio,
    fecha: cita.fecha,
    hora: cita.hora,
    estado: cita.estado,
    precioReservado: cita.precioReservado,
    notas: cita.notas ?? null,
    createdAt: fechaEnFormatoIso(cita.createdAt),
    updatedAt: fechaEnFormatoIso(cita.updatedAt),
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

export async function obtenerMisCitas(request, response, next) {
  try {
    const citas = await Cita.find({ usuarioId: request.usuario.id })
      .sort({ fecha: -1, hora: -1 })
      .populate({ path: 'servicioId', select: 'nombre' })
      .lean();
    const data = citas.map(respuestaPublicaDeConsulta);
    const message = data.length > 0
      ? 'Reservas consultadas correctamente'
      : 'No tienes reservas registradas';

    return sendResponse(response, 200, message, data);
  } catch (error) {
    return next(error);
  }
}
