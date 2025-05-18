import { Router } from 'express';
import { getEspecies, getRacasByEspecie } from '../controllers/especieController';

const router = Router();

router.get('', getEspecies);
router.get('/:especie/racas', getRacasByEspecie);

export default router;