import { Schema, model, Types } from "mongoose";
import { Endereco, EnderecoSchema } from "./Endereco";

export interface EventoAttributes {
    titulo: string;
    descricao: string;
    endereco: Endereco;
    data: Date;
    idAbrigo?: Types.ObjectId;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const EventoSchema = new Schema<EventoAttributes>(
    {
        titulo: { type: String, required: true },
        descricao: { type: String, required: true },
        endereco: { type: EnderecoSchema, required: true },
        data: { type: Date, required: true },
        idAbrigo: { type: Schema.Types.ObjectId, ref: 'Abrigo', required: true },
        ativo: { type: Boolean, required: true },
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

const EventoModel = model<EventoAttributes>("Evento", EventoSchema);
export default EventoModel;