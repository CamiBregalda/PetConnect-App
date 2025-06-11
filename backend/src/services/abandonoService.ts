import AbandonoModel from "../models/Abandono";
import { AbandonoAttributes } from "../models/Abandono";
import * as UsuarioService from "./userService";
import { AbandonoComUsuarioResponse } from "../models/responses/AbandonoComUsuarioResponse";

export const createAbandono = async (data: AbandonoAttributes) => {
    try {
        const usuario = await UsuarioService.getUserById(data.userId.toString());
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        const abandono = new AbandonoModel(data);
        abandono.ativo = true;
        await abandono.save();
        return AbandonoComUsuarioResponse.fromEntities(abandono, usuario);
    } catch (error: any) {
        throw new Error("Erro ao criar abandono: " + error.message);
    }
};

export const getAbandono = async () => {
    try {
        const abandonos = await AbandonoModel.find({ ativo: true }).select('-image');

        const responses = await Promise.all(abandonos.map(async (abandono) => {
            const usuario = await UsuarioService.getUserById(abandono.userId.toString());
            if (!usuario) {
                throw new Error("Usuário não encontrado");
            }
            return AbandonoComUsuarioResponse.fromEntities(abandono, usuario);
        }));

        return responses;
    } catch (error: any) {
        throw new Error("Erro ao buscar abandono: " + error.message);
    }
};

export const getAbandonoById = async (id: string) => {
    try {
        return await AbandonoModel.findOne({ _id: id, ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error("Erro ao buscar abandono: " + error.message);
    }
};

export const updateAbandono = async (id: string, updatedData: Partial<AbandonoAttributes>) => {
    try {
        const updatedFields = Object.keys(updatedData).reduce((acc, key) => {
            if (updatedData[key as keyof AbandonoAttributes] != null) {
                acc[key] = updatedData[key as keyof AbandonoAttributes];
            }
            return acc;
        }, {} as any);

        if (Object.keys(updatedFields).length === 0) {
            throw new Error("Nenhum campo válido para atualização");
        }

        return await AbandonoModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error: any) {
        throw new Error("Erro ao atualizar abandono: " + error.message);
    }
};

export const deleteAbandono = async (id: string) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });
        if (!abandono) {
            throw new Error("Abandono não encontrado");
        }
        abandono.ativo = false;
        await abandono.save();
        return abandono;
    } catch (error: any) {
        throw new Error("Erro ao deletar abandono: " + error.message);
    }
};

export const addImage = async (id: string, imagem: Buffer) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });

        if (!abandono) {
            throw new Error ('Registro de abandono não encontrado');
        }

        abandono.image = imagem;
        await abandono.save();
        return abandono;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });

        if (!abandono) {
            throw new Error ('Registro de abandono não encontrado');
        }

        if (!abandono.image) {
            throw new Error('Imagem não encontrada');
        }

        return abandono.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });

        if (!abandono) {
            throw new Error('Registro de abandono não encontrado');
        }

        abandono.image = undefined;

        await abandono.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};