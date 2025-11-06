import { Router } from 'express';
import {
  addToWishlist,
  getAllFromWishlist,
  removeAllInWishlist,
  removeItemFromWishList,
} from '../controllers/wishlistController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router.use(protect);
router.route('/').get(getAllFromWishlist).post(addToWishlist);
router.delete('/remove-all-wishlist', removeAllInWishlist);
router.delete('/remove-item-from-wishlist/:id', removeItemFromWishList);

export default router;
