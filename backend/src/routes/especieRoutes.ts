import { Router } from 'express';
import { getAllEspecies } from '../controllers/especieController';

const router = Router();

router.get('', getAllEspecies);

export default router;