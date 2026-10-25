import { Router } from 'express';

import {
  iniciarSesion,
  obtenerUsuarioAutenticado,
  registrarUsuario,
} from '../controllers/auth.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
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
authRoutes.get('/me', autenticarUsuario, obtenerUsuarioAutenticado);

export default authRoutes;
