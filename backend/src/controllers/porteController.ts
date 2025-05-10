import { Request, Response } from 'express';
import { getPortes } from '../services/porteService';

export const getAllPortes = (req: Request, res: Response) => {
    try {
        const portes = getPortes();
        return res.status(200).json(portes);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar portes', error: error.message });
    }
};
