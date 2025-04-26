import { Request, Response } from "express";
import * as AdmDeAbrigoService from "../services/admDeAbrigoService";

export const createAdmDeAbrigo = async (req: Request, res: Response) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoService.createAdmDeAbrigo(req.body);
        res.status(201).json(admDeAbrigo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdmDeAbrigos = async (req: Request, res: Response) => {
    try {
        const admDeAbrigos = await AdmDeAbrigoService.getAdmDeAbrigos();
        res.status(200).json(admDeAbrigos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdmDeAbrigoById = async (req: Request, res: Response) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoService.getAdmDeAbrigoById(req.params.id);
        if (!admDeAbrigo) {
            return res.status(404).json({ error: 'Administrador de abrigo não encontrado' });
        }
        res.status(200).json(admDeAbrigo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdmDeAbrigoWithAbrigo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await AdmDeAbrigoService.getAdmDeAbrigoWithAbrigo(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateAdmDeAbrigo = async (req: Request, res: Response) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoService.updateAdmDeAbrigo(req.params.id, req.body);
        if (!admDeAbrigo) {
            return res.status(404).json({ error: 'Administrador de abrigo não encontrado' });
        }
        res.status(200).json(admDeAbrigo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAdmDeAbrigo = async (req: Request, res: Response) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoService.deleteAdmDeAbrigo(req.params.id);
        if (!admDeAbrigo) {
            return res.status(404).json({ error: 'Administrador de abrigo não encontrado' });
        }
        res.status(200).json(admDeAbrigo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
