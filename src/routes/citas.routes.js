import { Router } from 'express';

import {
  cancelarCita,
  crearCita,
  obtenerDisponibilidad,
  obtenerMisCitas,
} from '../controllers/citas.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import {
  validarCita,
  validarDisponibilidad,
  validarIdCita,
  validarSolicitudCita,
  validarSolicitudDisponibilidad,
  validarSolicitudIdCita,
} from '../validators/citas.validator.js';

const citasRoutes = Router();

citasRoutes.get(
  '/disponibilidad',
  validarDisponibilidad,
  validarSolicitudDisponibilidad,
  obtenerDisponibilidad,
);
citasRoutes.get('/', autenticarUsuario, obtenerMisCitas);
citasRoutes.patch(
  '/:id/cancelar',
  autenticarUsuario,
  validarIdCita,
  validarSolicitudIdCita,
  cancelarCita,
);

citasRoutes.post(
  '/',
  autenticarUsuario,
  validarCita,
  validarSolicitudCita,
  crearCita,
);

export default citasRoutes;
