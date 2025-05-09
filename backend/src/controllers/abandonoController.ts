import { Request, Response } from "express";
import * as AbandonoService from "../services/abandonoService";

export const createAbandono = async (req: Request, res: Response) => {
    try {
        const evento = await AbandonoService.createAbandono(req.body);
        res.status(201).json(evento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAbandonos = async (req: Request, res: Response) => {
    try {
        const abandono = await AbandonoService.getAbandono();
        res.status(200).json(abandono);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAbandonoById = async (req: Request, res: Response) => {
    try {
        const evento = await AbandonoService.getAbandonoById(req.params.id);
        if (!evento) {
            return res.status(404).json({ message: "Abandono não encontrado" });
        }
        res.status(200).json(evento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAbandono = async (req: Request, res: Response) => {
    try {
        const updatedAbandono = await AbandonoService.updateAbandono(req.params.id, req.body);
        res.status(200).json(updatedAbandono);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAbandono = async (req: Request, res: Response) => {
    try {
        await AbandonoService.deleteAbandono(req.params.id);
        res.status(200).json({ message: "Abandono deletado com sucesso" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
