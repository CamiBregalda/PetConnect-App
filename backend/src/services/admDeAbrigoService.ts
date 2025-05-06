import AdmDeAbrigoModel from "../models/AdmDeAbrigo";
import * as AbrigoService from './abrigoService';
import { AdmDeAbrigoWithAbrigoResponse } from "../models/responses/AdmDeAbrigoComAbrigoResponse ";

export const createAdmDeAbrigo = async (data: any) => {
    try {
        const admDeAbrigo = new AdmDeAbrigoModel(data);
        admDeAbrigo.ativo = true;
        await admDeAbrigo.save();
        return admDeAbrigo;
    } catch (error: any) {
        throw new Error('Erro ao criar administrador de abrigo: ' + error.message);
    }
};

export const getAdmDeAbrigos = async () => {
    try {
        return await AdmDeAbrigoModel.find({ ativo: true });
    } catch (error: any) {
        throw new Error('Erro ao buscar administradores de abrigo: ' + error.message);
    }
};

export const getAdmDeAbrigoById = async (id: string) => {
    try {
        return await AdmDeAbrigoModel.findOne({ _id: id, ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error('Erro ao buscar administrador de abrigo: ' + error.message);
    }
};

export const getAdmDeAbrigoWithAbrigo = async (admId: string) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoModel.findOne({ _id: admId, ativo: true }).select('-image');

        if (!admDeAbrigo) {
            throw new Error('Administrador de abrigo não encontrado');
        }

        const abrigo = await AbrigoService.getAbrigoByAdmId(admId);

        return AdmDeAbrigoWithAbrigoResponse.fromEntities(admDeAbrigo, abrigo);
    } catch (error: any) {
        throw new Error('Erro ao buscar administrador e abrigo: ' + error.message);
    }
};

export const updateAdmDeAbrigo = async (id: string, updatedData: any) => {
    try {
        const updatedFields = Object.keys(updatedData).reduce((acc: any, key) => {
            if (updatedData[key] != null) {
                acc[key] = updatedData[key];
            }
            return acc;
        }, {});

        if (Object.keys(updatedFields).length === 0) {
            throw new Error('Nenhum campo válido para atualização');
        }

        return await AdmDeAbrigoModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error: any) {
        throw new Error('Erro ao atualizar administrador de abrigo: ' + error.message);
    }
};

export const deleteAdmDeAbrigo = async (id: string) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoModel.findOne({ _id: id, ativo: true });
        if (!admDeAbrigo) {
            throw new Error('Administrador de abrigo não encontrado');
        }
        admDeAbrigo.ativo = false;
        await admDeAbrigo.save();
        return admDeAbrigo;
    } catch (error: any) {
        throw new Error('Erro ao deletar administrador de abrigo: ' + error.message);
    }
};

export const uploudImage = async (id: string, image: Buffer) => {
    try {
        const adm = await AdmDeAbrigoModel.findOne({ _id: id, ativo: true });

        if (!adm) {
            throw new Error ('Adm de abrigo não encontrado');
        }

        adm.image = image;
        await adm.save();
        return adm;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const adm = await AdmDeAbrigoModel.findOne({ _id: id, ativo: true });

        if (!adm) {
            throw new Error ('Adm de abrigo não encontrado');
        }

        if (!adm.image) {
            throw new Error('Imagem não encontrada');
        }

        return adm.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const adm = await AdmDeAbrigoModel.findOne({ _id: id, ativo: true });

        if (!adm) {
            throw new Error('Adm de abrigo não encontrado');
        }

        adm.image = undefined;

        await adm.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};