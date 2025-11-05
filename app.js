import express from 'express';
import morgan from 'morgan';

import gameRoutes from './routes/gameRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();

app.use(express.json());

const env = (process.env.NODE_ENV || '').trim().toLowerCase();
if (env === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use(globalErrorHandler);

export default app;
