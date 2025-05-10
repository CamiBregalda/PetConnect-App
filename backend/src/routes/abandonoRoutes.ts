import { Router } from 'express';
import {
    createAbandono,
    getAbandonos,
    getAbandonoById,
    updateAbandono,
    deleteAbandono,
    addImage,
    getImage,
    deleteImage
} from '../controllers/abandonoController';

const router = Router();

router.post('', createAbandono);
router.get('', getAbandonos);
router.get('/:id', getAbandonoById);
router.put('/:id', updateAbandono);
router.delete('/:id', deleteAbandono);

router.post('/:id/imagem', addImage);
router.get('/:id/imagem/:image', getImage);
router.delete('/:id/imagem/:image', deleteImage);

export default router;