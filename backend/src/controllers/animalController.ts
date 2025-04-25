import { Request, Response } from "express";
import * as AnimalService from "../services/animalService";

export const createAnimal = async (req: Request, res: Response) => {
    try {
        const animal = await AnimalService.createAnimal(req.body);
        res.status(201).json(animal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnimais = async (_req: Request, res: Response) => {
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
