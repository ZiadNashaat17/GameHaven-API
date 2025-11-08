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
import { login, protect, register, restrictTo } from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.use(protect);

router.get('/get-me', getUser);
router.patch('/update-me', updateMe);
router.patch('/delete-me', deleteMe);
router.patch('/recover-me', recoverMe);

router.use(restrictTo('admin'));
router.get('/', getAllUsers);
router.route('/:id').patch(updateUser).delete(deleteUser);

export default router;
