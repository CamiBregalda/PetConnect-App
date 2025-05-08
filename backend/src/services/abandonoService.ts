import AbandonoModel from "../models/Abandono";
import { AbandonoAttributes } from "../models/Abandono";


export const createAbandono = async (data: AbandonoAttributes) => {
    try {
        const abandono = new AbandonoModel(data);
        abandono.ativo = true;
        await abandono.save();
        return abandono;
    } catch (error: any) {
        throw new Error("Erro ao criar abandono: " + error.message);
    }
};

export const getAbandono = async () => {
    try {
        return await AbandonoModel.find({ ativo: true });
    } catch (error: any) {
        throw new Error("Erro ao buscar abandono: " + error.message);
    }
};

export const getAbandonoById = async (id: string) => {
    try {
        return await AbandonoModel.findOne({ _id: id, ativo: true });
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

export const getAbandonosByAbandonoId = async (idAbandono: string) => {
    try {
        const abandonos = await AbandonoModel.find({ idAbandono: idAbandono, ativo: true });

        if (!abandonos || abandonos.length === 0) {
            throw new Error("Nenhum abandono encontrado para este abandono");
        }

        return abandonos;
    } catch (error: any) {
        throw new Error("Erro ao buscar abandonos pelo ID do abandono: " + error.message);
    }
};