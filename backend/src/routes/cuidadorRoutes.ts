import { Router } from 'express';
import { createCuidador, getCuidador, getCuidadorById, updateCuidador, deleteCuidador, uploadImage, getImage, deleteImage } from '../controllers/cuidadorController';

const router = Router();

router.post('', createCuidador);
router.get('', getCuidador);
router.get('/:id', getCuidadorById);
router.put('/:id', updateCuidador);
router.delete('/:id', deleteCuidador);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;