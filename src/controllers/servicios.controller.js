import Servicio from '../models/Servicio.js';
import { sendResponse } from '../utils/sendResponse.js';

export async function obtenerServicios(_request, response, next) {
  try {
    const servicios = await Servicio.find({ activo: true })
      .sort({ nombre: 1 })
      .select('nombre descripcion precio')
      .lean();

    const data = servicios.map((servicio) => ({
      id: servicio._id.toString(),
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
    }));
    const message = data.length > 0
      ? 'Servicios consultados correctamente'
      : 'No hay servicios disponibles';

    return sendResponse(response, 200, message, data);
  } catch (error) {
    return next(error);
  }
}
