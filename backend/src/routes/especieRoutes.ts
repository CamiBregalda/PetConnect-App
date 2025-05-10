import { Router } from 'express';
import { getEspecies } from '../controllers/especieController';

const router = Router();

router.get('', getEspecies);

export default router;