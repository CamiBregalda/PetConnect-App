import { Types } from "mongoose";
import CuidadorModel, { CuidadorFactory } from "../models/Cuidador";
import { CuidadorResponse } from "../models/responses/CuidadorResponse";
import * as UserService from './userService';
import * as EventoService from './eventoService';

export const createCuidador = async (data: any) => {
    try {
        UserService.updateUser(data.userId, data);

        const existingUser = await CuidadorModel.findOne({ userId: data.userId, ativo: true });
        if (existingUser) {
            throw new Error('Cuidador já existente para este usuário');
        }

        const Cuidador = new CuidadorModel(data);
        Cuidador.ativo = true;
        await Cuidador.save();
        return Cuidador;
    } catch (error: any) {
        throw new Error('Erro ao criar administrador de abrigo: ' + error.message);
    }
};

export const createCuidadorByUserId = async (userId: string, abrigoId: string) => {
    try {
        const user = await UserService.getUserById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const Cuidador = CuidadorFactory.createFromUser(user, userId, abrigoId);
        Cuidador.ativo = true;
        await Cuidador.save();
        return Cuidador;
    } catch (error: any) {
        throw new Error('Erro ao criar administrador de abrigo: ' + error.message);
    }
};

export const getCuidador = async () => {
    try {
        const listCuidadores = await CuidadorModel.find({ ativo: true }).populate('userId');

        return listCuidadores.map((cuidador) => CuidadorResponse.fromEntities(cuidador));
    } catch (error: any) {
        throw new Error('Erro ao buscar cuidadores de abrigo: ' + error.message);
    }
};

export const getCuidadorById = async (id: string) => {
    try {
        const cuidador = await CuidadorModel.findOne({ _id: id, ativo: true }).populate('userId');
        
        if (!cuidador || !cuidador.userId) {
            throw new Error('Cuidador de abrigo não encontrado');
        }
        
        return CuidadorResponse.fromEntities(cuidador);
    } catch (error: any) {
        throw new Error('Erro ao buscar cuidador de abrigo: ' + error.message);
    }
};

export const getCuidadorByUserId = async (user: string) => {
    try {
        const objectUserId = new Types.ObjectId(user);
        const cuidador = await CuidadorModel.findOne({ userId: objectUserId, ativo: true }).populate('userId');

        if (!cuidador || !cuidador.userId) {
            throw new Error('Cuidador de abrigo não encontrado');
        }

        return CuidadorResponse.fromEntities(cuidador);
    } catch (error: any) {
        throw new Error('Erro ao buscar cuidador de abrigo: ' + error.message);
    }
};

export const getCuidadoresByAbrigoId = async (abrigoId: string) => {
    try {
        const objectAbrigoId = new Types.ObjectId(abrigoId);
        const listCuidadores = await CuidadorModel.find({ abrigoId: objectAbrigoId, ativo: true }).populate('userId');

        return listCuidadores.map((cuidador) => CuidadorResponse.fromEntities(cuidador));
    } catch (error: any) {
        throw new Error("Erro ao buscar Cuidadores do abrigo: " + error.message);
    }
};

export const getCuidadoresByEventoId = async (eventoId: string) => {
    try {
        const evento = await EventoService.getEventoById(eventoId);
        if (!evento || !evento.idAbrigo) {
            throw new Error("Evento não encontrado ou sem abrigo associado");
        }

        const listCuidadores = await CuidadorModel.find({ abrigoId: evento.idAbrigo, ativo: true }).populate('userId');

        return listCuidadores.map((cuidador) => CuidadorResponse.fromEntities(cuidador));
    } catch (error: any) {
        throw new Error("Erro ao buscar cuidadores do abrigo do evento: " + error.message);
    }
};

export const updateCuidador = async (id: string, updatedData: any) => {
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

        const cuidador = await CuidadorModel.findByIdAndUpdate(id, updatedFields, { new: true });
        
        if (!cuidador) {
            throw new Error('Cuidador não encontrado');
        }
        
        UserService.updateUser(cuidador.userId.toString(), updatedFields);
        
        return CuidadorResponse.fromEntities(cuidador);
    } catch (error: any) {
        throw new Error('Erro ao atualizar cuidador: ' + error.message);
    }
};

export const deleteCuidador = async (id: string) => {
    try {
        const Cuidador = await CuidadorModel.findOne({ _id: id, ativo: true });
        if (!Cuidador) {
            throw new Error('Cuidador de abrigo não encontrado');
        }
        Cuidador.ativo = false;
        await Cuidador.save();
        return Cuidador;
    } catch (error: any) {
        throw new Error('Erro ao deletar administrador de abrigo: ' + error.message);
    }
};

export const uploudImage = async (id: string, image: Buffer) => {
    try {
        const cuidador = await CuidadorModel.findOne({ _id: id, ativo: true });

        if (!cuidador) {
            throw new Error ('Cuidador não encontrado');
        }

        return UserService.uploudImage(cuidador.userId.toString(), image);
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const cuidador = await CuidadorModel.findOne({ _id: id, ativo: true });

        if (!cuidador) {
            throw new Error ('Cuidador não encontrado');
        }

        return await UserService.getImage(cuidador.userId.toString());
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const cuidador = await CuidadorModel.findOne({ _id: id, ativo: true });

        if (!cuidador) {
            throw new Error('Cuidador não encontrado');
        }

        await await UserService.deleteImage(cuidador.userId.toString());
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};