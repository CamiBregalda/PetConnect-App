import mongoose, { Schema, Document } from 'mongoose';
import { Endereco, EnderecoSchema } from "./Endereco";


export interface EventoAttributes {
    titulo: string;
  descricao: string;
  objetivo: string;
  dataInicio: Date;
  dataFim: Date;
  endereco: Endereco;
  idAbrigo: mongoose.Schema.Types.ObjectId;
  image?: Buffer;
}

const EventoSchema = new Schema<EventoAttributes>(
    {
      titulo:     { type: String, required: true },
      descricao:  { type: String, required: true },
      objetivo:   { type: String, required: true },
      dataInicio: { type: Date,   required: true },
      dataFim:    { type: Date,   required: true },
      endereco:   { type: EnderecoSchema, required: true },
      idAbrigo:   { type: mongoose.Schema.Types.ObjectId, ref: 'Abrigo', required: true },
      image:      { type: Buffer, required: false },
      ativo:      { type: Boolean, required: false, default: true },
    },
    {
      collection: "eventos",
      timestamps: true,
      toJSON: {
        virtuals: true,
        transform: (_, ret) => {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        }
      }
    }
);

const EventoModel = mongoose.model<EventoAttributes>('Evento', EventoSchema);
export default EventoModel;