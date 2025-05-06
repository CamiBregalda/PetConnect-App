import { Router } from 'express';
import { 
    createAdmDeAbrigo, getAdmDeAbrigos, getAdmDeAbrigoById, updateAdmDeAbrigo, deleteAdmDeAbrigo, getAdmDeAbrigoWithAbrigo, uploadImage, getImage, deleteImage 
} from '../controllers/admDeAbrigoController';

const router = Router();

router.post('', createAdmDeAbrigo);
router.get('', getAdmDeAbrigos);
router.get('/:id', getAdmDeAbrigoById);
router.get('/:id/abrigo', getAdmDeAbrigoWithAbrigo);
router.put('/:id', updateAdmDeAbrigo);
router.delete('/:id', deleteAdmDeAbrigo);

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;
