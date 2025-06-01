import { Router } from 'express';
import { getCoordenadasPeloEndereco } from '../controllers/EnderecoController';

const router = Router();

router.post('', getCoordenadasPeloEndereco);

export default router;