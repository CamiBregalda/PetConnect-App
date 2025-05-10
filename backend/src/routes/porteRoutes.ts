import { Router } from 'express';
import { getPortes } from '../controllers/porteController';

const router = Router();

router.get('', getPortes);

export default router;