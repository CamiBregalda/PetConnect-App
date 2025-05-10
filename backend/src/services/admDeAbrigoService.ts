import AdmDeAbrigoModel from "../models/AdmDeAbrigo";
import * as AbrigoService from './abrigoService';
import * as UserService from './userService';
import { AdmDeAbrigoWithAbrigoResponse } from "../models/responses/AdmDeAbrigoComAbrigoResponse ";
import { AdmDeAbrigoResponse } from "../models/responses/AdmDeAbrigoResponse";

export const createAdmDeAbrigo = async (data: any) => {
    try {
        UserService.updateUser(data.userId, data);

        const existingUser = await AdmDeAbrigoModel.findOne({ userId: data.userId, ativo: true });
        if (existingUser) {
            throw new Error('Administrador de Abrigo já existente para este usuário');
        }

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
        const listAdm = await AdmDeAbrigoModel.find({ ativo: true }).populate('userId');

        return listAdm.map((adm) => AdmDeAbrigoResponse.fromEntities(adm));
    } catch (error: any) {
        throw new Error('Erro ao buscar administradores de abrigo: ' + error.message);
    }
};

export const getAdmDeAbrigoById = async (id: string) => {
    try {
        const admAbrigo = await AdmDeAbrigoModel.findOne({ _id: id, ativo: true }).populate('userId');

        if (!admAbrigo || !admAbrigo.userId) {
            throw new Error('Administrador de abrigo não encontrado');
        }

        return AdmDeAbrigoResponse.fromEntities(admAbrigo);
    } catch (error: any) {
        throw new Error('Erro ao buscar administrador de abrigo: ' + error.message);
    }
};

export const getAdmDeAbrigoWithAbrigo = async (admId: string) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoModel.findOne({ _id: admId, ativo: true }).populate('userId');

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

        const adm = await AdmDeAbrigoModel.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!adm) {
            throw new Error('Administrador de abrigo não encontrado');
        }

        UserService.updateUser(adm.userId.toString(), updatedFields);

        return AdmDeAbrigoResponse.fromEntities(adm);
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

        return UserService.uploudImage(adm.userId.toString(), image);
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

        return UserService.getImage(adm.userId.toString());
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

        return UserService.deleteImage(adm.userId.toString());
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};