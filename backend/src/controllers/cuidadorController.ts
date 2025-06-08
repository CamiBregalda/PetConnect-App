import { Request, Response } from 'express';
import * as CuidadorService from '../services/cuidadorService';
import { validateImage } from '../utils/imageUtil';
import multer from "multer";

const upload = multer();

export const createCuidador = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.createCuidador(req.body);
        res.status(201).json(Cuidador);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCuidadorByUserId = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.createCuidadorByUserId(req.params.userId, req.query.abrigoId as string);
        res.status(201).json(Cuidador);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCuidador = async (req: Request, res: Response) => {
    try {
        const Cuidador = await CuidadorService.getCuidador();
        res.status(200).json(Cuidador);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCuidadorById = async (req: Request, res: Response) => {
    try {
        const cuidador = await CuidadorService.getCuidadorById(req.params.id);
        res.status(200).json(cuidador);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCuidadorByUserId = async (req: Request, res: Response) => {
    try {
        const cuidador = await CuidadorService.getCuidadorByUserId(req.params.userId);
        res.status(200).json(cuidador);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getVoluntariosPorEvento = async (req: Request, res: Response) => {
    try {
        const { eventoId } = req.params;

        if (!eventoId) {
            return res.status(400).json({ message: 'ID do evento não fornecido' });
        }

        const voluntarios = await CuidadorService.getVoluntariosPorEvento(eventoId);

        if (!voluntarios || voluntarios.length === 0) {
            return res.status(404).json({ message: 'Nenhum voluntário encontrado para este evento' });
        }

        res.status(200).json(voluntarios);
    } catch (error: any) {
        console.error('Erro ao buscar voluntários por evento:', error);
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
    } catch (error: any) {
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadImage = [
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            const cuidadorId = req.params.id;
            validateImage(req.file);
            const imageBuffer = req.file?.buffer;

            if (!imageBuffer) {
                return res.status(400).json({ message: 'Imagem não enviada' });
            }

            const user = await CuidadorService.uploudImage(cuidadorId, imageBuffer);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
];

export const getImage = async (req: Request, res: Response) => {
    try {
        const cuidadorId = req.params.id;
        const image = await CuidadorService.getImage(cuidadorId);

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
    const cuidadorId = req.params.id;

    try {
        await CuidadorService.deleteImage(cuidadorId);

        return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};