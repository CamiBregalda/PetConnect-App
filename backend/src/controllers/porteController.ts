import { Request, Response } from 'express';
import * as PorteService from '../services/porteService';

export const getPortes = (req: Request, res: Response) => {
    try {
        const portes = PorteService.getPortes();
        return res.status(200).json(portes);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar portes', error: error.message });
    }
};
