import { Router } from 'express';
import {
    createCandidatura,
    getCandidaturas,
    getCandidaturaById,
    getCandidaturasByAbrigoId,
    updateCandidatura,
    deleteCandidatura
} from '../controllers/candidaturaController';

const router = Router();

router.post('', createCandidatura);
router.get('', getCandidaturas);
router.get('/:id', getCandidaturaById);
router.get('/abrigo/:id', getCandidaturasByAbrigoId);
router.put('/:id', updateCandidatura);
router.delete('/:id', deleteCandidatura);

export default router;