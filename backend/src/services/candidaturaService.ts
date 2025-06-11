import { Types } from "mongoose";
import CandidaturaModel from "../models/Candidatura";
import { CandidaturaAttributes } from "../models/Candidatura";
import * as CuidadorService from './cuidadorService';
import * as AbrigoService from './abrigoService';
import * as UserService from './userService';
import { CandidaturaResponse } from "../models/responses/CandidaturaResponse";

export const createCandidatura = async (data: any) => {
    try {
        UserService.updateUser(data.userId.toString(), data);

        const candidatura = new CandidaturaModel(data);
        candidatura.ativo = true;
        await candidatura.save();
        return candidatura;
    } catch (error: any) {
        throw new Error("Erro ao criar candidatura: " + error.message);
    }
};

export const getCandidaturas = async () => {
    try {
        const listCandidaturas = await CandidaturaModel.find({ ativo: true }).populate('userId');
        return listCandidaturas.map((candidatura) => CandidaturaResponse.fromEntities(candidatura));
    } catch (error: any) {
        throw new Error("Erro ao buscar candidaturas: " + error.message);
    }
};

export const getCandidaturaById = async (id: string) => {
    try {
        const candidatura = await CandidaturaModel.findOne({ _id: id, ativo: true }).populate('userId');
        if (!candidatura || !candidatura.userId) {
            throw new Error("Candidatura não encontrada");
        }
        return CandidaturaResponse.fromEntities(candidatura);
    } catch (error: any) {
        throw new Error("Erro ao buscar candidatura: " + error.message);
    }
};

export const getCandidaturasByAbrigoId = async (id: string) => {
    try {
        const objectAbrigoId = new Types.ObjectId(id);
        const listCandidaturas = await CandidaturaModel.find({ abrigoId: objectAbrigoId, ativo: true }).populate('userId');

        return listCandidaturas.map((candidatura) => CandidaturaResponse.fromEntities(candidatura));
    } catch (error: any) {
        throw new Error("Erro ao buscar candidatura: " + error.message);
    }
};

export const updateCandidatura = async (id: string, updatedData: Partial<CandidaturaAttributes>) => {
    try {
        const updatedFields = Object.keys(updatedData).reduce((acc, key) => {
            if (updatedData[key as keyof CandidaturaAttributes] != null) {
                acc[key] = updatedData[key as keyof CandidaturaAttributes];
            }
            return acc;
        }, {} as any);

        if (Object.keys(updatedFields).length === 0) {
            throw new Error("Nenhum campo válido para atualização");
        }

        const candidatura = await CandidaturaModel.findByIdAndUpdate(id, updatedFields, { new: true });

        if (candidatura && candidatura.aprovacao && candidatura.aprovacao === true) {
            const cuidador = await CuidadorService.createCuidadorByUserId(candidatura.userId.toString(), candidatura.abrigoId.toString());
            await AbrigoService.addCuidadorToAbrigo(candidatura.abrigoId.toString(), cuidador.id);
        }

        return candidatura;
    } catch (error: any) {
        throw new Error("Erro ao atualizar candidatura: " + error.message);
    }
};

export const deleteCandidatura = async (id: string) => {
    try {
        const candidatura = await CandidaturaModel.findOne({ _id: id, ativo: true });
        if (!candidatura) {
            throw new Error("Candidatura não encontrada");
        }
        candidatura.ativo = false;
        await candidatura.save();
        return candidatura;
    } catch (error: any) {
        throw new Error("Erro ao deletar candidatura: " + error.message);
    }
};