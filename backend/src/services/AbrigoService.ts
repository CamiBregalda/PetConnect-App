import AbrigoModel from '../models/Abrigo';
import { getAnimaisByAbrigoId } from './animalService';
import { getCuidadoresByAbrigoId } from './cuidadorService';
import * as AdmDeAbrigoService from '../services/admDeAbrigoService';
import { AbrigoComAnimaisResponse } from "../models/responses/AbrigoComAnimaisResponse";
import { AbrigoComCuidadoresResponse } from "../models/responses/AbrigoComCuidadoresResponse";
import { AbrigoComUserIdResponse } from '../models/responses/AbrigoComUserIdResponse';


export const createAbrigo = async (userId: string, abrigoData: any) => {
    try {
        const admDeAbrigo = await AdmDeAbrigoService.createAdmDeAbrigo({ userId: userId });
        if (!admDeAbrigo) {
            throw new Error('Administrador de abrigo não pôde ser criado!');
        }

        abrigoData.idAdmAbrigo = admDeAbrigo._id;
        const abrigo = new AbrigoModel(abrigoData);
        abrigo.ativo = true;
        await abrigo.save();
        return abrigo;
    } catch (error: any) {
        throw new Error('Erro ao criar abrigo: ' + error.message);
    }
};

export const getAbrigos = async () => {
    try {
        const abrigos = await AbrigoModel.find({ ativo: true }).select('-image');
        
        const abrigoComUserIds = await Promise.all(
            abrigos.map(async (abrigo) => {
                if (!abrigo.idAdmAbrigo) {
                    throw new Error('Abrigo não possui administrador associado');
                }
                const admAbrigo = await AdmDeAbrigoService.getAdmDeAbrigoById(abrigo.idAdmAbrigo.toString());
                if (!admAbrigo || !admAbrigo.userId) {
                    throw new Error('Administrador de abrigo não encontrado');
                }
                return AbrigoComUserIdResponse.fromEntities(abrigo, admAbrigo.userId);
            })
        );

        return abrigoComUserIds;
    } catch (error: any) {
        throw new Error('Erro ao buscar abrigos: ' + error.message);
    }
};

export const getAbrigoById = async (id: string) => {
    try {
        const abrigo = await AbrigoModel.findOne({ _id: id, ativo: true }).select('-image');
        
        if (!abrigo) {
            throw new Error('Abrigo não encontrado');
        }

        if (!abrigo.idAdmAbrigo) {
            throw new Error('Abrigo não possui administrador associado');
        }

        const admAbrigo = await AdmDeAbrigoService.getAdmDeAbrigoById(abrigo.idAdmAbrigo.toString());
        if (!admAbrigo || !admAbrigo.userId) {
            throw new Error('Administrador de abrigo não encontrado');
        }

        return AbrigoComUserIdResponse.fromEntities(abrigo, admAbrigo.userId);
    } catch (error: any) {
        throw new Error('Erro ao buscar abrigo: ' + error.message);
    }
};

export const getAbrigoByAdmId = async (abrigoId: string) => {
    try {
        const abrigo = await AbrigoModel.findOne({ idAdmAbrigo: abrigoId, ativo: true }).select('-image');
        if (!abrigo) {
            throw new Error('Abrigo não encontrado');
        }
        return abrigo;
    } catch (error: any) {
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

export const getAbrigoWithCuidadores = async (abrigoId: string) => {
    try {
        const abrigo = await getAbrigoById(abrigoId);
        const cuidadores = await getCuidadoresByAbrigoId(abrigoId);

        return AbrigoComCuidadoresResponse.fromEntities(abrigo, cuidadores);
    } catch (error: any) {
        throw new Error('Erro ao buscar abrigo e cuidadores: ' + error.message);
    }
};

export const getAbrigosPorUsuario = async (userId: string) => {
    try {
        const abrigos = await AbrigoModel.find({ cuidadores: userId, ativo: true }).select('-image');
        const abrigoAdm = await AdmDeAbrigoService.getAdmDeAbrigoByUserId(userId);
        if (abrigoAdm && abrigoAdm.id) {
            const abrigo = await getAbrigoByAdmId(abrigoAdm.id);
            abrigos.push(abrigo);
        }

        if (!abrigos || abrigos.length === 0) {
            throw new Error('Abrigos não encontrados');
        }
        return abrigos;
    } catch (error: any) {
        throw new Error('Erro ao buscar abrigos por usuário: ' + error.message);
    }
};

export const updateAbrigo = async (id: string, updatedData: any) => {
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

        return await AbrigoModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error: any) {
        throw new Error('Erro ao atualizar abrigo: ' + error.message);
    }
};

export const deleteAbrigo = async (id: string) => {
    try {
        const abrigo = await AbrigoModel.findOne({ _id: id, ativo: true });
        if (!abrigo) {
            throw new Error('Abrigo não encontrado');
        }
        abrigo.ativo = false;
        await abrigo.save();
        return abrigo;
    } catch (error: any) {
        throw new Error('Erro ao deletar abrigo: ' + error.message);
    }
};

export const uploudImage = async (id: string, image: Buffer) => {
    try {
        const abrigo = await AbrigoModel.findOne({ _id: id, ativo: true });

        if (!abrigo) {
            throw new Error ('Abrigo não encontrado');
        }

        abrigo.image = image;
        await abrigo.save();
        return abrigo;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const abrigo = await AbrigoModel.findOne({ _id: id, ativo: true });

        if (!abrigo) {
            throw new Error ('Abrigo não encontrado');
        }

        if (!abrigo.image) {
            throw new Error('Imagem não encontrada');
        }

        return abrigo.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const abrigo = await AbrigoModel.findOne({ _id: id, ativo: true });

        if (!abrigo) {
            throw new Error('Abrigo não encontrado');
        }

        abrigo.image = undefined;

        await abrigo.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};