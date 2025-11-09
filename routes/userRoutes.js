import { Router } from 'express';
import {
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  recoverMe,
  updateMe,
  updateUser,
} from '../controllers/userController.js';
import {
  changePassword,
  forgetPassword,
  login,
  protect,
  register,
  resetPassword,
  restrictTo,
} from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

router.use(protect);

router.get('/get-me', getUser);
router.patch('/update-me', updateMe);
router.patch('/delete-me', deleteMe);
router.patch('/recover-me', recoverMe);
router.patch('/change-password', changePassword);

router.use(restrictTo('admin'));
router.get('/', getAllUsers);
router.route('/:id').patch(updateUser).delete(deleteUser);

export default router;
