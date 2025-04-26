import { Router } from 'express';
import { 
    createAdmDeAbrigo, 
    getAdmDeAbrigos, 
    getAdmDeAbrigoById, 
    updateAdmDeAbrigo, 
    deleteAdmDeAbrigo, 
    getAdmDeAbrigoWithAbrigo 
} from '../controllers/admDeAbrigoController';

const router = Router();

router.post('', createAdmDeAbrigo);
router.get('', getAdmDeAbrigos);
router.get('/:id', getAdmDeAbrigoById);
router.get('/:id/abrigo', getAdmDeAbrigoWithAbrigo);
router.put('/:id', updateAdmDeAbrigo);
router.delete('/:id', deleteAdmDeAbrigo);

export default router;
