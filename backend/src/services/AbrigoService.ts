import AbrigoModel from '../models/Abrigo';
import { getAnimaisByAbrigoId } from './AnimalService';
import { AbrigoComAnimaisResponse } from "../models/responses/AbrigoComAnimaisResponse";

export const createAbrigo = async (abrigoData: any) => {
    try {
        const abrigo = new AbrigoModel(abrigoData);
        abrigo.ativo = true;
        await abrigo.save();
        return abrigo;
    } catch (error) {
        throw new Error('Erro ao criar abrigo: ' + error.message);
    }
};

export const getAbrigos = async () => {
    try {
        return await AbrigoModel.find({ ativo: true });
    } catch (error) {
        throw new Error('Erro ao buscar abrigos: ' + error.message);
    }
};

export const getAbrigoById = async (id: string) => {
    try {
        return await AbrigoModel.findOne({ _id: id, ativo: true });
    } catch (error) {
        throw new Error('Erro ao buscar abrigo: ' + error.message);
    }
};

export const getAbrigoByAdmId = async (abrigoId: string) => {
    try {
        const abrigo = await AbrigoModel.findOne({ idAdmAbrigo: abrigoId, ativo: true });
        if (!abrigo) {
            throw new Error('Abrigo não encontrado');
        }
        return abrigo;
    } catch (error) {
        throw new Error('Erro ao buscar abrigo e administrador: ' + error.message);
    }
};

export const getAbrigoWithAnimais = async (abrigoId: string) => {
    try {
        const abrigo = await getAbrigoById(abrigoId);
        const animais = await getAnimaisByAbrigoId(abrigoId);

        return AbrigoComAnimaisResponse.fromEntities(abrigo, animais);
    } catch (error: any) {
        throw new Error('Erro ao buscar abrigo e animais: ' + error.message);
    }
};

export const updateAbrigo = async (id: string, updatedData: any) => {
    try {
        const updatedFields = Object.keys(updatedData).reduce((acc, key) => {
            if (updatedData[key] != null) {
                acc[key] = updatedData[key];
            }
            return acc;
        }, {});

        if (Object.keys(updatedFields).length === 0) {
            throw new Error('Nenhum campo válido para atualização');
        }

        return await AbrigoModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error) {
        throw new Error('Erro ao atualizar abrigo: ' + error.message);
    }
};

export const deleteAbrigo = async (id: string) => {
    try {
        const abrigo = await AbrigoModel.findById(id);
        if (!abrigo) {
            throw new Error('Abrigo não encontrado');
        }
        abrigo.ativo = false;
        await abrigo.save();
        return abrigo;
    } catch (error) {
        throw new Error('Erro ao deletar abrigo: ' + error.message);
    }
};