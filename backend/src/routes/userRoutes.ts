import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, uploadImage, getImage, deleteImage } from '../controllers/userController';

const router = Router();

router.post('', createUser);
router.get('', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.post('/:id/image', uploadImage);
router.get('/:id/image', getImage);
router.delete('/:id/image', deleteImage);

export default router;