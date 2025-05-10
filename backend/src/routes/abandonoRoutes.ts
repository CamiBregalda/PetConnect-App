import { Router } from 'express';
import {
    createAbandono,
    getAbandonos,
    getAbandonoById,
    updateAbandono,
    deleteAbandono,
} from '../controllers/abandonoController';

const router = Router();

router.post('', createAbandono);
router.get('', getAbandonos);
router.get('/:id', getAbandonoById);
router.put('/:id', updateAbandono);
router.delete('/:id', deleteAbandono);

export default router;