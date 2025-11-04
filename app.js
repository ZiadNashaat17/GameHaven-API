import express from 'express';
import morgan from 'morgan';

const app = express();

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}

export default app;
