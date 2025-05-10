import { Router } from 'express';
import { getAllPortes } from '../controllers/especieController';

const router = Router();

router.get('', getAllPortes);

export default router;