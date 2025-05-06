import { Request, Response } from "express";
import * as EventoService from "../services/eventoService";

export const createEvento = async (req: Request, res: Response) => {
    try {
        const evento = await EventoService.createEvento(req.body);
        res.status(201).json(evento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventos = async (req: Request, res: Response) => {
    try {
        const eventos = await EventoService.getEventos();
        res.status(200).json(eventos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventoById = async (req: Request, res: Response) => {
    try {
        const evento = await EventoService.getEventoById(req.params.id);
        if (!evento) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }
        res.status(200).json(evento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvento = async (req: Request, res: Response) => {
    try {
        const updatedEvento = await EventoService.updateEvento(req.params.id, req.body);
        res.status(200).json(updatedEvento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvento = async (req: Request, res: Response) => {
    try {
        await EventoService.deleteEvento(req.params.id);
        res.status(200).json({ message: "Evento deletado com sucesso" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventosByAbrigoId = async (req: Request, res: Response) => {
    try {
        const eventos = await EventoService.getEventosByAbrigoId(req.params.idAbrigo);
        res.status(200).json(eventos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};