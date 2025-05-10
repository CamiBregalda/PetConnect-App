import { Request, Response } from 'express';
import * as racaService from '../services/racaService';

export const getRacasByEspecie = (req: Request, res: Response) => {
    try {
        const especie = req.params.especie;

        const racas = racaService.getRacasByEspecie(especie);
        return res.status(200).json(racas);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar raças', error: error.message });
    }
};
