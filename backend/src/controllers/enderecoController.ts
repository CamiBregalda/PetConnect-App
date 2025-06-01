import { Request, Response } from "express";
import * as locationIQIntegration from "../services/locationIQIntegration";
import { Endereco } from "../models/Endereco";

export const getCoordenadasPeloEndereco = async (req: Request, res: Response) => {
    try {
        const { rua, numero, bairro, cidade, estado, cep } = req.body;

        const endereco = new Endereco(rua, numero, bairro, cidade, estado, cep);

        const coordenadas = await locationIQIntegration.getCoordenadasPeloEndereco(endereco);
        console.log(`Coordenadas obtidas: ${JSON.stringify(coordenadas)}`);
        return res.status(200).json(coordenadas);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro ao buscar coordenadas', error: error.message });
    }
};