import { Router } from 'express';

import {
  crearCita,
  obtenerMisCitas,
} from '../controllers/citas.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import {
  validarCita,
  validarSolicitudCita,
} from '../validators/citas.validator.js';

const citasRoutes = Router();

citasRoutes.get('/', autenticarUsuario, obtenerMisCitas);

citasRoutes.post(
  '/',
  autenticarUsuario,
  validarCita,
  validarSolicitudCita,
  crearCita,
);

export default citasRoutes;
