import { Router } from 'express';
import {
    createEvento,
    getEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    getEventosByAbrigoId
} from '../controllers/eventoController';

const router = Router();

router.post('', createEvento);
router.get('', getEventos);
router.get('/:id', getEventoById);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);
router.get("/abrigo/:idAbrigo", getEventosByAbrigoId);

export default router;