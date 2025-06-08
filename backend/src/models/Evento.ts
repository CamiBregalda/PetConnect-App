import mongoose, { Schema, Document } from 'mongoose';

export interface EventoAttributes extends Document {
  titulo: string;
  descricao: string;
  objetivo: string;
  dataInicio: string;
  dataFim: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  imagemUrl?: string;
}


const eventoSchema = new mongoose.Schema({
  titulo:     { type: String, required: true },
  descricao:  { type: String, required: true },
  objetivo:   { type: String, required: true },
  dataInicio: { type: Date,   required: true },
  dataFim:    { type: Date,   required: true },
  endereco: {
    rua:    { type: String, required: true },
    numero: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep:    { type: String, required: true },
  },
  idAbrigo: { type: mongoose.Schema.Types.ObjectId, ref: 'Abrigo', required: true },
  ativo:    { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.model<EventoAttributes>('Evento', eventoSchema);