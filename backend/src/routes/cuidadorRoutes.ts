import { Router } from 'express';
import { createCuidador, createCuidadorByUserId, getCuidador, getCuidadorById, getCuidadorByUserId, getVoluntariosPorEvento, updateCuidador, deleteCuidador, uploadImage, getImage, deleteImage } from '../controllers/cuidadorController';

const router = Router();

router.post('', createCuidador);
router.post('/user/:userId', createCuidadorByUserId);
router.get('', getCuidador);
router.get('/:id', getCuidadorById);
router.get('/user/:userId', getCuidadorByUserId);
router.get('/eventos/:eventoId/voluntarios', getVoluntariosPorEvento);
router.put('/:id', updateCuidador);
router.delete('/:id', deleteCuidador);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;