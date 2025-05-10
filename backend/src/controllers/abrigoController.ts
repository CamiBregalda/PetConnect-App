    import { Request, Response } from 'express';
    import * as AbrigoService from '../services/abrigoService';
    import { validateImage } from '../utils/imageUtil';
    import multer from "multer";

    const upload = multer();

    export const createAbrigo = async (req: Request, res: Response) => {
        try {
            const abrigo = await AbrigoService.createAbrigo(req.body);
            res.status(201).json(abrigo);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    export const getAbrigos = async (req: Request, res: Response) => {
        try {
            const abrigos = await AbrigoService.getAbrigos();
            res.status(200).json(abrigos);
        } catch (error: any) {
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
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    export const getAbrigoWithAnimais = async (req: Request, res: Response) => {
        try {
            const abrigo = await AbrigoService.getAbrigoWithAnimais(req.params.id);
            if (abrigo) {
                res.status(200).json(abrigo);
            } else {
                res.status(404).json({ message: 'Abrigo não encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    export const getAbrigoWithCuidadores = async (req: Request, res: Response) => {
        try {
            const cuidador = await AbrigoService.getAbrigoWithCuidadores(req.params.id);
            if (cuidador) {
                res.status(200).json(cuidador);
            } else {
                res.status(404).json({ message: 'Abrigo não encontrado' });
            }
        } catch (error: any) {
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
        } catch (error: any) {
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
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    export const uploadImage = [
        upload.single('image'),
        async (req: Request, res: Response) => {
            try {
                const abrigoId = req.params.id;
                validateImage(req.file);
                const imageBuffer = req.file?.buffer;

                if (!imageBuffer) {
                    return res.status(400).json({ message: 'Imagem não enviada' });
                }

                const user = await AbrigoService.uploudImage(abrigoId, imageBuffer);
                return res.status(200).json(user);
            } catch (error: any) {
                return res.status(500).json({ message: error.message });
            }
        }
    ];

    export const getImage = async (req: Request, res: Response) => {
        try {
            const abrigoId = req.params.id;
            const image = await AbrigoService.getImage(abrigoId);

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
        const abrigoId = req.params.id;

        try {
            await AbrigoService.deleteImage(abrigoId);

            return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };