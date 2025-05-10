import { Request, Response } from "express";
import * as EspecieService from "../services/especieService";

export const getAllEspecies = async (req: Request, res: Response) => {
    try {
        const especies = await EspecieService.getAllEspecies();
        res.status(200).json(especies);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar espécies', error: error.message });
    }
};