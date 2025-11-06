import { Router } from 'express';
import {
  AddItemToCart,
  getAllCartItems,
  removeItemFromCart,
  removeWholeItemFromCart,
  updateTotalPrice,
} from '../controllers/cartController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router.use(protect);
router.route('/').get(getAllCartItems).post(AddItemToCart);
router.delete('/:id', removeItemFromCart);
router.delete('/delete-all-item/:id', removeWholeItemFromCart);

export default router;
