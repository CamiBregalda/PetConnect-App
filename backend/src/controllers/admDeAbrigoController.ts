import { Request, Response } from "express";
import * as AdmDeAbrigoService from "../services/admDeAbrigoService";
import * as UserService from "../services/userService";
import { validateImage } from '../utils/imageUtil';
import multer from "multer";

const upload = multer();

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

export const uploadImage = [
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            const admId = req.params.id;
            validateImage(req.file);
            const imageBuffer = req.file?.buffer;

            if (!imageBuffer) {
                return res.status(400).json({ message: 'Imagem não enviada' });
            }

            const user = await AdmDeAbrigoService.uploudImage(admId, imageBuffer);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
];

export const getImage = async (req: Request, res: Response) => {
    try {
        const admId = req.params.id;
        const image = await AdmDeAbrigoService.getImage(admId);

        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': image.length,
        });
        return res.end(image);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteImage = async (req: Request, res: Response) => {
    const admId = req.params.id;

    try {
        await AdmDeAbrigoService.deleteImage(admId);

        return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};