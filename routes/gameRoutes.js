import { Router } from 'express';
import {
  createGame,
  deleteGame,
  getAllGames,
  getGame,
  getGameCategories,
  updateGame,
} from '../controllers/gameController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import reviewRouter from './reviewRoutes.js';

const router = Router();

router.use('/:gameId/reviews', reviewRouter);

router.get('/', getAllGames);
router.get('/categories', getGameCategories);
router.get('/:id', getGame);

router.use(protect, restrictTo('admin'));
router.route('/').post(createGame);
router.route('/:id').patch(updateGame).delete(deleteGame);

export default router;
