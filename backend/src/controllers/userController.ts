import { Request, Response } from "express";
import * as userService from "../services/userService";
import { validateImage } from '../utils/imageUtil';
import { LoginRequest } from "../models/requests/LoginRequest";
import multer from "multer";

const upload = multer();

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const usuario = await userService.loginUser(new LoginRequest(email, senha));

    res.status(200).json({
      id: usuario.id,
      email: usuario.email,
      mensagem: 'Login realizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ message: 'Falha ao realizar login' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json({ message: "Usuário desativado com sucesso", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao desativar usuário", error });
  }
};

export const uploadImage = [
  upload.single('image'),
  async (req: Request, res: Response) => {
      try {
          const userId = req.params.id;
          validateImage(req.file);
          const imageBuffer = req.file?.buffer;

          if (!imageBuffer) {
              return res.status(400).json({ message: 'Imagem não enviada' });
          }

          const user = await userService.uploudImage(userId, imageBuffer);
          return res.status(200).json(user);
      } catch (error: any) {
          return res.status(500).json({ message: error.message });
      }
  }
];

export const getImage = async (req: Request, res: Response) => {
  try {
      const userId = req.params.id;
      const image = await userService.getImage(userId);

      res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': image.length,
      });
      return res.end(image);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
      await userService.deleteImage(userId);

      return res.status(200).json({ message: 'Imagem excluída com sucesso!' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};