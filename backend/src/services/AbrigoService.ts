import AbrigoModel from '../models/Abrigo'; // Substitua por sua model Mongoose

export const createAbrigo = async (abrigoData: any) => {
    try {
        const abrigo = new AbrigoModel(abrigoData);
        await abrigo.save();
        return abrigo;
    } catch (error) {
        throw new Error('Erro ao criar abrigo');
    }
};

export const getAbrigos = async () => {
    try {
        return await AbrigoModel.find();
    } catch (error) {
        throw new Error('Erro ao buscar abrigos');
    }
};

export const getAbrigoById = async (id: string) => {
    try {
        return await AbrigoModel.findById(id);
    } catch (error) {
        throw new Error('Erro ao buscar abrigo');
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
        throw new Error('Erro ao atualizar abrigo');
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
        throw new Error('Erro ao deletar abrigo');
    }
};