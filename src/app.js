import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import { sendResponse } from './utils/sendResponse.js';

const app = express();
const api = express.Router();

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
app.use(express.json());

api.get('/health', (_request, response) => {
  sendResponse(response, 200, 'API de TurnoFácil funcionando', {
    service: 'TurnoFácil Backend',
  });
});

api.use('/auth', authRoutes);
app.use('/api/v1', api);

app.use((_request, response) => {
  sendResponse(response, 404, 'Recurso no encontrado');
});

app.use(errorHandler);

export default app;
