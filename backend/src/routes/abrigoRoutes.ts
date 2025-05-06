import { Router } from 'express';
import {
    createAbrigo,
    getAbrigos,
    getAbrigoById,
    getAbrigoWithAnimais,
    updateAbrigo,
    deleteAbrigo, 
    uploadImage, 
    getImage, 
    deleteImage
} from '../controllers/abrigoController';

const router = Router();

router.post('/', createAbrigo);
router.get('/', getAbrigos);
router.get('/:id', getAbrigoById);
router.get('/:id/animais', getAbrigoWithAnimais);
router.put('/:id', updateAbrigo);
router.delete('/:id', deleteAbrigo);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;
