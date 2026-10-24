import { Router } from 'express';

import {
  iniciarSesion,
  registrarUsuario,
} from '../controllers/auth.controller.js';
import {
  validarLogin,
  validarRegistro,
  validarSolicitudLogin,
  validarSolicitudRegistro,
} from '../validators/auth.validator.js';

const authRoutes = Router();

authRoutes.post(
  '/registro',
  validarRegistro,
  validarSolicitudRegistro,
  registrarUsuario,
);
authRoutes.post(
  '/login',
  validarLogin,
  validarSolicitudLogin,
  iniciarSesion,
);

export default authRoutes;
