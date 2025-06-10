import AnimalModel from "../models/Animal";
import * as UserService from "./userService";

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
        return await AnimalModel.find({ ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error("Erro ao buscar animais: " + error.message);
    }
};

export const getAnimalById = async (id: string) => {
    try {
        return await AnimalModel.findOne({ _id: id, ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error("Erro ao buscar animal: " + error.message);
    }
};

export const getAnimaisByAbrigoId = async (abrigoId: string) => {
    try {
        const animais = await AnimalModel.find({ idDono: abrigoId, ativo: true });
        return animais;
    } catch (error: any) {
        throw new Error("Erro ao buscar animais do abrigo: " + error.message);
    }
};

export const getAnimaisAdotadosPorUsuario = async (userId: string) => {
    try {
        const animais = await AnimalModel.find({ idDono: userId, ativo: true }).select('-image');
        return animais;
    } catch (error: any) {
        throw new Error("Erro ao buscar animais do abrigo: " + error.message);
    }
};

export const updateAnimal = async (id: string, updatedData: any) => {
    try {
        if (updatedData.email && updatedData.adotado === true) {
            for (const key in updatedData) {
                if (key === "email") {
                    const user = await UserService.getUserByEmail(updatedData[key]);

                    if (user) {
                        updatedData.idDono = user.id;
                    } else {
                        throw new Error("Usuário não encontrado");
                    }
                }
            }
        }

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

export const updateAdocaoStatus = async (id: string, updatedData: any) => {
    try {
        const user = await UserService.getUserByEmail(updatedData.email);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const animal = await AnimalModel.findOne({ _id: id, ativo: true });
        if (!animal) {
            throw new Error("Animal não encontrado");
        }

        animal.idDono = user.id;
        animal.adotado = true;
        const updatedAnimal = await AnimalModel.findByIdAndUpdate(id, animal).select('-image');
        return updatedAnimal;
    } catch (error: any) {
        throw new Error("Erro ao atualizar status de adoção: " + error.message);
    }
};

export const deleteAnimal = async (id: string) => {
    try {
        const animal = await AnimalModel.findOne({ _id: id, ativo: true });
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

export const uploudImage = async (id: string, image: Buffer) => {
    try {
        const animal = await AnimalModel.findOne({ _id: id, ativo: true });

        if (!animal) {
            throw new Error ('Animal não encontrado');
        }

        animal.image = image;
        await animal.save();
        return animal;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const animal = await AnimalModel.findOne({ _id: id, ativo: true });

        if (!animal) {
            throw new Error ('Animal não encontrado');
        }

        if (!animal.image) {
            throw new Error('Imagem não encontrada');
        }

        return animal.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const animal = await AnimalModel.findOne({ _id: id, ativo: true });

        if (!animal) {
            throw new Error('Animal não encontrado');
        }

        animal.image = undefined;

        await animal.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};