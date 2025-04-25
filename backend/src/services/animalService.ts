import AnimalModel from "../models/Animal";

export const createAnimal = async (data: any) => {
    try {
        const animal = new AnimalModel(data);
        animal.ativo = true;
        await animal.save();
        return animal;
    } catch (error: any) {
        throw new Error("Erro ao criar animal: " + error.message);
    }
};

export const getAnimais = async () => {
    try {
        return await AnimalModel.find({ ativo: true });
    } catch (error: any) {
        throw new Error("Erro ao buscar animais: " + error.message);
    }
};

export const getAnimalById = async (id: string) => {
    try {
        return await AnimalModel.findOne({ _id: id, ativo: true });
    } catch (error: any) {
        throw new Error("Erro ao buscar animal: " + error.message);
    }
};

export const updateAnimal = async (id: string, updatedData: any) => {
    try {
        const updatedFields = Object.keys(updatedData).reduce((acc, key) => {
            if (updatedData[key] != null) {
                acc[key] = updatedData[key];
            }
            return acc;
        }, {} as any);

        if (Object.keys(updatedFields).length === 0) {
            throw new Error("Nenhum campo válido para atualização");
        }

        return await AnimalModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error: any) {
        throw new Error("Erro ao atualizar animal: " + error.message);
    }
};

export const deleteAnimal = async (id: string) => {
    try {
        const animal = await AnimalModel.findById(id);
        if (!animal) {
            throw new Error("Animal não encontrado");
        }
        animal.ativo = false;
        await animal.save();
        return animal;
    } catch (error: any) {
        throw new Error("Erro ao deletar animal: " + error.message);
    }
};