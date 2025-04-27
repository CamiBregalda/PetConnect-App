import { Request, Response } from 'express';
import * as CuidadorService from '../services/CuidadorService';

export const createCuidador = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.createCuidador(req.body);
        res.status(201).json(Cuidador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCuidador = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.getCuidador();
        res.status(200).json(Cuidador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCuidadorById = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.getCuidadorById(req.params.id);
        if (Cuidador) {
            res.status(200).json(Cuidador);
        } else {
            res.status(404).json({ message: 'Cuidador não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateCuidador = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.updateCuidador(req.params.id, req.body);
        if (Cuidador) {
            res.status(200).json({ message: 'Cuidador atualizado com sucesso', Cuidador });
        } else {
            res.status(404).json({ message: 'Cuidador não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCuidador = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.deleteCuidador(req.params.id);
        if (Cuidador) {
            res.status(200).json({ message: 'Cuidador marcado como inativo' });
        } else {
            res.status(404).json({ message: 'Cuidador não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};