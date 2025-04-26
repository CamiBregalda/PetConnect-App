import { Router } from 'express';
import {
    createAbrigo,
    getAbrigos,
    getAbrigoById,
    getAbrigoWithAnimais,
    updateAbrigo,
    deleteAbrigo,
} from '../controllers/abrigoController';

const router = Router();

router.post('/', createAbrigo);
router.get('/', getAbrigos);
router.get('/:id', getAbrigoById);
router.get('/:id/animais', getAbrigoWithAnimais);
router.put('/:id', updateAbrigo);
router.delete('/:id', deleteAbrigo);

export default router;
