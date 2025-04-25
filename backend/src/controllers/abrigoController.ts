import { Request, Response } from 'express';
import * as AbrigoService from '../services/abrigoService';

export const createAbrigo = async (req: Request, res: Response) => {
    try {
        const abrigo = await AbrigoService.createAbrigo(req.body);
        res.status(201).json(abrigo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAbrigos = async (_req: Request, res: Response) => {
    try {
        const abrigos = await AbrigoService.getAbrigos();
        res.status(200).json(abrigos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAbrigoById = async (req: Request, res: Response) => {
    try {
        const abrigo = await AbrigoService.getAbrigoById(req.params.id);
        if (abrigo) {
            res.status(200).json(abrigo);
        } else {
            res.status(404).json({ message: 'Abrigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAbrigo = async (req: Request, res: Response) => {
    try {
        const abrigo = await AbrigoService.updateAbrigo(req.params.id, req.body);
        if (abrigo) {
            res.status(200).json({ message: 'Abrigo atualizado com sucesso', abrigo });
        } else {
            res.status(404).json({ message: 'Abrigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAbrigo = async (req: Request, res: Response) => {
    try {
        const abrigo = await AbrigoService.deleteAbrigo(req.params.id);
        if (abrigo) {
            res.status(200).json({ message: 'Abrigo marcado como inativo' });
        } else {
            res.status(404).json({ message: 'Abrigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};