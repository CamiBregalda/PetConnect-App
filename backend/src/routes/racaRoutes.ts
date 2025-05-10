import { Router } from 'express';
import { getRacasByEspecie } from '../controllers/racaController';

const router = Router();

router.get('/especie/:especie', getRacasByEspecie);

export default router;