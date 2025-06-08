import { Request, Response } from "express";
import * as EventoService from "../services/eventoService";
import EventoModel from "../models/Evento";

export const createEvento = async (req: Request, res: Response) => {
    try {
        const evento = await EventoService.createEvento(req.body);
        res.status(201).json(evento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventos = async (req: Request, res: Response) => {
    try {
        const eventos = await EventoService.getEventos();
        res.status(200).json(eventos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventoById = async (req: Request, res: Response) => {
    try {
        const evento = await EventoService.getEventoById(req.params.id);
        if (!evento) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }
        res.status(200).json(evento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('ID recebido no backend:', id);

    if (!id) {
      console.error('ID do evento não fornecido');
      return res.status(400).json({ error: 'ID do evento não fornecido' });
    }

    const updatedData = req.body;
    console.log('Dados recebidos para atualização:', updatedData);

    const evento = await EventoModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!evento) {
      console.error('Evento não encontrado');
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.status(200).json(evento);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento.' });
  }
};

export const uploadEventoImagem = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        res.status(200).json({ message: 'Imagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao processar upload de imagem:', error);
        res.status(500).json({ error: 'Erro ao enviar a imagem.' });
    }
};

export const deleteEvento = async (req: Request, res: Response) => {
    try {
        await EventoService.deleteEvento(req.params.id);
        res.status(200).json({ message: "Evento deletado com sucesso" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventosByAbrigoId = async (req: Request, res: Response) => {
    try {
        const eventos = await EventoService.getEventosByAbrigoId(req.params.idAbrigo);
        res.status(200).json(eventos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};