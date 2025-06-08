import { Request, Response } from "express";
import * as AbandonoService from "../services/abandonoService";
import { validateImage } from '../utils/imageUtil';
import { fileTypeFromBuffer } from 'file-type';
import multer from "multer";

const upload = multer();

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

export const addImage = [
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            const abandonoId = req.params.id;
            validateImage(req.file);
            const imageBuffer = req.file?.buffer;

            if (!imageBuffer) {
                return res.status(400).json({ message: 'Imagem não enviada' });
            }

            const abandono = await AbandonoService.addImage(abandonoId, imageBuffer);
            return res.status(200).json(abandono);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
];

export const getImage = async (req: Request, res: Response) => {
    try {
        const abandonoId = req.params.id;
        const image = await AbandonoService.getImage(abandonoId);

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
    const abandonoId = req.params.id;

    try {
        await AbandonoService.deleteImage(abandonoId);

        return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};