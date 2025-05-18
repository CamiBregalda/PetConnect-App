import { Router } from 'express';
import { loginUser, createUser, getUsers, getUserById, updateUser, deleteUser, uploadImage, getImage, deleteImage } from '../controllers/userController';

const router = Router();

router.post('/login', loginUser);

router.post('', createUser);
router.get('', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;