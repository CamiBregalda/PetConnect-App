import { Router } from 'express';
import * as abrigoController from '../controllers/abrigoController';
import {
    createAbrigo,
    getAbrigos,
    getAbrigoById,
    getAbrigoWithAnimais,
    getAbrigoWithCuidadores,
    updateAbrigo,
    deleteAbrigo, 
    uploadImage, 
    getImage, 
    deleteImage
} from '../controllers/abrigoController';

const router = Router();

router.post('/:userId', createAbrigo);
router.get('/', getAbrigos);
router.get('/:id', getAbrigoById);
router.get('/:id/animais', getAbrigoWithAnimais);
router.get('/:id/cuidadores', getAbrigoWithCuidadores);
router.put('/:id', updateAbrigo);
router.delete('/:id', deleteAbrigo);
router.get('/voluntarios/:userId', abrigoController.getAbrigosPorVoluntario);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;
