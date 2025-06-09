import { Request, Response } from "express";
import * as EventoService from "../services/eventoService";
import EventoModel from "../models/Evento";
import { validateImage } from '../utils/imageUtil';
import { fileTypeFromBuffer } from 'file-type';
import multer from "multer";

const upload = multer();

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
    console.log('PUT /eventos/:id recebendo →', req.body);
    try {
        const eventoId = req.params.id;

        if (!eventoId) {
        return res.status(400).json({ error: 'ID do evento não fornecido' });
        }

        const updatedData = req.body;
        const evento = await EventoService.updateEvento(eventoId, updatedData);

        if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado' });
        }

        res.status(200).json(evento);
    } catch (error) {
        return res.status(500).json({ error: error.message });
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

export const uploadImage = [
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            const eventoId = req.params.id;
            validateImage(req.file);
            const imageBuffer = req.file?.buffer;

            if (!imageBuffer) {
                return res.status(400).json({ message: 'Imagem não enviada' });
            }

            const evento = await EventoService.uploadImage(eventoId, imageBuffer);
            return res.status(200).json(evento);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
];

export const getImage = async (req: Request, res: Response) => {
    try {
        const eventoId = req.params.id;
        const image = await EventoService.getImage(eventoId);

        const type = await fileTypeFromBuffer(image);

        res.writeHead(200, {
            'Content-Type': type?.mime || 'image/jpeg',
            'Content-Length': image.length,
        });
        return res.end(image);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteImage = async (req: Request, res: Response) => {
    const eventoId = req.params.id;

    try {
        await EventoService.deleteImage(eventoId);

        return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};