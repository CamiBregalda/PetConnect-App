import AbandonoModel from "../models/Abandono";
import { AbandonoAttributes } from "../models/Abandono";
import { Imagem } from "../models/Imagem";

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
        return await AbandonoModel.find({ ativo: true }).select('-images');
    } catch (error: any) {
        throw new Error("Erro ao buscar abandono: " + error.message);
    }
};

export const getAbandonoById = async (id: string) => {
    try {
        return await AbandonoModel.findOne({ _id: id, ativo: true }).select('-images');
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

export const addImage = async (id: string, imagem: Imagem) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });

        if (!abandono) {
            throw new Error ('Registro de abandono não encontrado');
        }

        abandono.images.push(imagem)
        await abandono.save();
        return abandono;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string, fileName: string) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });

        if (!abandono) {
            throw new Error ('Registro de abandono não encontrado');
        }

        if (!abandono.images) {
            throw new Error('Imagem não encontrada');
        }

        //const imagem = abandono.images[0];
        const imagem = abandono.images.find(img => img.name === fileName);
        if (!imagem) {
            throw new Error(fileName);
        }

        return imagem.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string, fileName: string) => {
    try {
        const abandono = await AbandonoModel.findOne({ _id: id, ativo: true });

        if (!abandono) {
            throw new Error ('Registro de abandono não encontrado');
        }

        if (!abandono.images) {
            throw new Error('Imagem não encontrada');
        }

        abandono.images = abandono.images.filter(image => image.name !== fileName);

        await abandono.save();
        return abandono;
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};