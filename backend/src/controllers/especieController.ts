import { Request, Response } from "express";
import * as EspecieService from "../services/especieService";

export const getEspecies = async (req: Request, res: Response) => {
    try {
        const especies = EspecieService.getAllEspecies();
        res.status(200).json(especies);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar espécies', error: error.message });
    }
};

export const getRacasByEspecie = (req: Request, res: Response) => {
    try {
        const especie = req.params.especie;

        const racas = EspecieService.getRacasByEspecie(especie);
        return res.status(200).json(racas);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar raças', error: error.message });
    }
};