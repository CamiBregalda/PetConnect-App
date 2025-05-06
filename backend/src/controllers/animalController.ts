import { Request, Response } from "express";
import * as AnimalService from "../services/animalService";
import { validateImage } from '../utils/imageUtil';
import multer from "multer";

const upload = multer();

export const createAnimal = async (req: Request, res: Response) => {
    try {
        const animal = await AnimalService.createAnimal(req.body);
        res.status(201).json(animal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnimais = async (req: Request, res: Response) => {
    try {
        const animais = await AnimalService.getAnimais();
        res.status(200).json(animais);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnimalById = async (req: Request, res: Response) => {
    try {
        const animal = await AnimalService.getAnimalById(req.params.id);
        if (!animal) {
            return res.status(404).json({ message: "Animal não encontrado" });
        }
        res.status(200).json(animal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAnimal = async (req: Request, res: Response) => {
    try {
        const updatedAnimal = await AnimalService.updateAnimal(req.params.id, req.body);
        res.status(200).json(updatedAnimal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAnimal = async (req: Request, res: Response) => {
    try {
        const deletedAnimal = await AnimalService.deleteAnimal(req.params.id);
        res.status(200).json(deletedAnimal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadImage = [
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            const animalId = req.params.id;
            validateImage(req.file);
            const imageBuffer = req.file?.buffer;

            if (!imageBuffer) {
                return res.status(400).json({ message: 'Imagem não enviada' });
            }

            const animal = await AnimalService.uploudImage(animalId, imageBuffer);
            return res.status(200).json(animal);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
];

export const getImage = async (req: Request, res: Response) => {
    try {
        const animalId = req.params.id;
        const image = await AnimalService.getImage(animalId);

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
    const animalId = req.params.id;

    try {
        await AnimalService.deleteImage(animalId);

        return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};