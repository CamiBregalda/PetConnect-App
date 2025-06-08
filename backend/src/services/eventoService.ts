import EventoModel from "../models/Evento";
import { EventoAttributes } from "../models/Evento";

export const createEvento = async (data: EventoAttributes) => {
    try {
        const evento = new EventoModel(data);
        evento.ativo = true;
        await evento.save();
        return evento;
    } catch (error: any) {
        throw new Error("Erro ao criar evento: " + error.message);
    }
};

export const getEventos = async () => {
    try {
        return await EventoModel.find({ ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error("Erro ao buscar eventos: " + error.message);
    }
};

export const getEventoById = async (id: string) => {
    try {
        return await EventoModel.findOne({ _id: id, ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error("Erro ao buscar evento: " + error.message);
    }
};

export const updateEvento = async (id: string, updatedData: Partial<EventoAttributes>) => {
    try {
        const updatedFields = Object.keys(updatedData).reduce((acc, key) => {
            if (updatedData[key as keyof EventoAttributes] != null) {
                acc[key] = updatedData[key as keyof EventoAttributes];
            }
            return acc;
        }, {} as any);

        if (Object.keys(updatedFields).length === 0) {
            throw new Error("Nenhum campo válido para atualização");
        }

        return await EventoModel.findByIdAndUpdate(id, updatedFields);
    } catch (error: any) {
        throw new Error("Erro ao atualizar evento: " + error.message);
    }
};

export const deleteEvento = async (id: string) => {
    try {
        const evento = await EventoModel.findOne({ _id: id, ativo: true });
        if (!evento) {
            throw new Error("Evento não encontrado");
        }
        evento.ativo = false;
        await evento.save();
        return evento;
    } catch (error: any) {
        throw new Error("Erro ao deletar evento: " + error.message);
    }
};

export const getEventosByAbrigoId = async (idAbrigo: string) => {
    try {
        const eventos = await EventoModel.find({ idAbrigo: idAbrigo, ativo: true });

        if (!eventos || eventos.length === 0) {
            throw new Error("Nenhum evento encontrado para este abrigo");
        }

        return eventos;
    } catch (error: any) {
        throw new Error("Erro ao buscar eventos pelo ID do abrigo: " + error.message);
    }
};

export const uploadImage = async (id: string, image: Buffer) => {
    try {
        const evento = await EventoModel.findOne({ _id: id, ativo: true });

        if (!evento) {
            throw new Error ('Evento não encontrado');
        }

        evento.image = image;
        await evento.save();
        return evento;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const evento = await EventoModel.findOne({ _id: id, ativo: true });

        if (!evento) {
            throw new Error ('Evento não encontrado');
        }

        if (!evento.image) {
            throw new Error('Imagem não encontrada');
        }

        return evento.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const evento = await EventoModel.findOne({ _id: id, ativo: true });

        if (!evento) {
            throw new Error('Evento não encontrado');
        }

        evento.image = undefined;

        await evento.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};