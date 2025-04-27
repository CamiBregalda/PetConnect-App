import CuidadorModel from "../models/Cuidador";


export const createCuidador = async (data: any) => {
    try {
        const Cuidador = new CuidadorModel(data);
        Cuidador.ativo = true;
        await Cuidador.save();
        return Cuidador;
    } catch (error: any) {
        throw new Error('Erro ao criar administrador de abrigo: ' + error.message);
    }
};

export const getCuidador = async () => {
    try {
        return await CuidadorModel.find({ ativo: true });    } catch (error: any) {
        throw new Error('Erro ao buscar administradores de abrigo: ' + error.message);
    }
};

export const getCuidadorById = async (id: string) => {
    try {
        return await CuidadorModel.findOne({ _id: id, ativo: true });
    } catch (error: any) {
        throw new Error('Erro ao buscar administrador de abrigo: ' + error.message);
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

        return await CuidadorModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error: any) {
        throw new Error('Erro ao atualizar administrador de abrigo: ' + error.message);
    }
};

export const deleteCuidador = async (id: string) => {
    try {
        const Cuidador = await CuidadorModel.findById(id);
        if (!Cuidador) {
            throw new Error('Administrador de abrigo não encontrado');
        }
        Cuidador.ativo = false;
        await Cuidador.save();
        return Cuidador;
    } catch (error: any) {
        throw new Error('Erro ao deletar administrador de abrigo: ' + error.message);
    }
};