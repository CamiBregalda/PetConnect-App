import multer from 'multer';
import { Router } from 'express';
import {
    createEvento,
    getEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    getEventosByAbrigoId,
    uploadEventoImagem
} from '../controllers/eventoController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('', createEvento);
router.get('', getEventos);
router.get('/:id', getEventoById);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);
router.get("/abrigo/:idAbrigo", getEventosByAbrigoId);
router.post('/eventos/:id/imagem', upload.single('image'), uploadEventoImagem);

export default router;