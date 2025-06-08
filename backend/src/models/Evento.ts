import mongoose, { Schema, Document } from 'mongoose';
import { Endereco, EnderecoSchema } from "./Endereco";

export interface EventoAttributes extends Document {
  titulo: string;
  descricao: string;
  objetivo: string;
  dataInicio: string;
  dataFim: string;
  endereco: Endereco;
  idAbrigo: mongoose.Schema.Types.ObjectId;
  image?: Buffer;
  imagemUrl?: string;
}


const eventoSchema = new mongoose.Schema({
  titulo:     { type: String, required: true },
  descricao:  { type: String, required: true },
  objetivo:   { type: String, required: true },
  dataInicio: { type: Date,   required: true },
  dataFim:    { type: Date,   required: true },
  endereco:   { type: EnderecoSchema, required: true },
  idAbrigo:   { type: mongoose.Schema.Types.ObjectId, ref: 'Abrigo', required: true },
  image:      { type: Buffer, required: false },
  ativo:      { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.model<EventoAttributes>('Evento', eventoSchema);