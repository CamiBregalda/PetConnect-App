import UserModel from "../models/User";
import { LoginRequest } from "../models/requests/LoginRequest";
import bcrypt from 'bcrypt';

export const loginUser = async (login: LoginRequest) => {

    const usuario = await UserModel.findOne({ email: login.email, senha: login.senha, ativo: true }).select('-image');

    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    /*const senhaCorreta = await bcrypt.compare(login.senha, usuario.senha);
    if (!senhaCorreta) {
        throw new Error('Senha inválida');
    }*/

    return usuario;
};

export const createUser = async (data: any) => {
    try {
        const existingUser = await UserModel.findOne({ email: data.email, ativo: true });
        if (existingUser) {
            throw new Error('Email já cadastrado!');
        }

        const user = new UserModel(data);
        user.ativo = true;
        await user.save();
        return user;
    } catch (error: any) {
        throw new Error('Erro ao criar usuário: ' + error.message);
    }
};

export const getUsers = async () => {
    try {
        return await UserModel.find({ ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error('Erro ao buscar usuários: ' + error.message);
    }
};

export const getUserById = async (id: string) => {
    try {
        return await UserModel.findOne({ _id: id, ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error('Erro ao buscar usuário: ' + error.message);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        return await UserModel.findOne({ email, ativo: true }).select('-image');
    } catch (error: any) {
        throw new Error('Erro ao buscar usuário: ' + error.message);
    }
};

export const updateUser = async (id: string, updatedData: any) => {
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

        return await UserModel.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error: any) {
        throw new Error('Erro ao atualizar usuário: ' + error.message);
    }
};

export const deleteUser = async (id: string) => {
    try {
        const user = await UserModel.findOne({ _id: id, ativo: true });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        user.ativo = false;
        await user.save();
        return user;
    } catch (error: any) {
        throw new Error('Erro ao deletar usuário: ' + error.message);
    }
};

export const uploudImage = async (id: string, image: Buffer) => {
    try {
        const user = await UserModel.findOne({ _id: id, ativo: true });

        if (!user) {
            throw new Error ('Usuário não encontrado');
        }

        user.image = image;
        await user.save();
        return user;
    } catch (error: any) {
        throw new Error('Erro ao salvar imagem: ' + error.message);
    }   
};

export const getImage = async (id: string) => {
    try {
        const user = await UserModel.findOne({ _id: id, ativo: true });

        if (!user) {
            throw new Error ('Usuário não encontrado');
        }

        if (!user.image) {
            throw new Error('Imagem não encontrada');
        }

        return user.image;
    } catch (error: any) {
        throw new Error('Erro ao obter imagem: ' + error.message);
    }
};

export const deleteImage = async (id: string) => {
    try {
        const user = await UserModel.findOne({ _id: id, ativo: true });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        user.image = undefined;

        await user.save();
    } catch (error: any) {
        throw new Error('Erro ao remover imagem: ' + error.message);
    }
};