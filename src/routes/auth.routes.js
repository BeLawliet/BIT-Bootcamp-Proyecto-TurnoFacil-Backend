import { Router } from 'express';

import { registrarUsuario } from '../controllers/auth.controller.js';
import {
  validarRegistro,
  validarSolicitudRegistro,
} from '../validators/auth.validator.js';

const authRoutes = Router();

authRoutes.post(
  '/registro',
  validarRegistro,
  validarSolicitudRegistro,
  registrarUsuario,
);

export default authRoutes;
