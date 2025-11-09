import express from 'express';
import morgan from 'morgan';

import gameRoutes from './routes/gameRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

const app = express();

app.use(helmet());

const env = (process.env.NODE_ENV || '').trim().toLowerCase();
if (env === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests! Try again after 15 minutes.',
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['price', 'author', 'category', 'language'],
  })
);

app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);

app.use(globalErrorHandler);

export default app;
