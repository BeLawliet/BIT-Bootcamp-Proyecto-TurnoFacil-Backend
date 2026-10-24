import { Router } from 'express';

import { obtenerServicios } from '../controllers/servicios.controller.js';

const serviciosRoutes = Router();

serviciosRoutes.get('/', obtenerServicios);

export default serviciosRoutes;
