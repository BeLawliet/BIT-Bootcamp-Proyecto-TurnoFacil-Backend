import { Router } from 'express';

import {
  cancelarCita,
  crearCita,
  obtenerMisCitas,
} from '../controllers/citas.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import {
  validarCita,
  validarIdCita,
  validarSolicitudCita,
  validarSolicitudIdCita,
} from '../validators/citas.validator.js';

const citasRoutes = Router();

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
