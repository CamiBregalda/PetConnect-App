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

router.post('/:id/imagem', uploadImage);
router.get('/:id/imagem', getImage);
router.delete('/:id/imagem', deleteImage);

export default router;