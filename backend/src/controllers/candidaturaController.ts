import { Request, Response } from "express";
import * as CandidaturaService from "../services/candidaturaService";

export const createCandidatura = async (req: Request, res: Response) => {
    try {
        const candidatura = await CandidaturaService.createCandidatura(req.body);
        res.status(201).json(candidatura);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCandidaturas = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;
        const abrigoId = req.query.abrigoId as string;

        const candidaturas = await CandidaturaService.getCandidaturas(userId, abrigoId);
        res.status(200).json(candidaturas);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCandidaturaById = async (req: Request, res: Response) => {
    try {
        const candidatura = await CandidaturaService.getCandidaturaById(req.params.id);
        res.status(200).json(candidatura);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCandidaturasByAbrigoId = async (req: Request, res: Response) => {
    try {
        const candidatura = await CandidaturaService.getCandidaturasByAbrigoId(req.params.id);
        res.status(200).json(candidatura);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCandidatura = async (req: Request, res: Response) => {
    try {
        const candidatura = await CandidaturaService.updateCandidatura(req.params.id, req.body);
        res.status(200).json(candidatura);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCandidatura = async (req: Request, res: Response) => {
    try {
        await CandidaturaService.deleteCandidatura(req.params.id);
        res.status(200).json({ message: "Candidatura deletada com sucesso" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};