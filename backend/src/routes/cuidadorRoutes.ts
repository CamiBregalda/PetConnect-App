import { Router } from 'express';
import { createCuidador, getCuidador, getCuidadorById, updateCuidador, deleteCuidador } from '../controllers/cuidadorController';

const router = Router();

router.post('', createCuidador);
router.get('', getCuidador);
router.get('/:id', getCuidadorById);
router.put('/:id', updateCuidador);
router.delete('/:id', deleteCuidador);

export default router;