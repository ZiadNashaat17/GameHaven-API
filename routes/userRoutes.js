import { Router } from 'express';
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController.js';
import { login, protect, register, restrictTo } from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.use(protect);

router.get('/:id', getUser);

router.use(restrictTo('admin'));
router.get('/', getAllUsers);
router.route('/:id').patch(updateUser).delete(deleteUser);

export default router;
