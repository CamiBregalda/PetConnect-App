import { Router } from 'express';
import {
    createCandidatura,
    getCandidaturas,
    getCandidaturaById,
    updateCandidatura,
    deleteCandidatura
} from '../controllers/candidaturaController';

const router = Router();

router.post('', createCandidatura);
router.get('', getCandidaturas);
router.get('/:id', getCandidaturaById);
router.put('/:id', updateCandidatura);
router.delete('/:id', deleteCandidatura);

export default router;