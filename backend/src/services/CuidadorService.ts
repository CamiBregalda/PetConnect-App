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
        const Cuidador = await CuidadorModel.findOne({ _id: id, ativo: true });
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

export const uploudImage = async (id: string, image: Buffer) => {
    try {
        const cuidador = await CuidadorModel.findOne({ _id: id, ativo: true });

        if (!cuidador) {
            throw new Error ('Cuidador não encontrado');
        }

        cuidador.image = image;
        await cuidador.save();
        return cuidador;
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

        if (!cuidador.image) {
            throw new Error('Imagem não encontrada');
        }

        return cuidador.image;
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

        cuidador.image = undefined;

        await cuidador.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};