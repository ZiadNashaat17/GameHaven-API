import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = Router({ mergeParams: true });

router.get('/', getAllReviews);
router.get('/:id', getReview);

router.use(protect, restrictTo('user'));

router.post('/', createReview);
router.route('/:id').patch(updateReview).delete(deleteReview);

export default router;
