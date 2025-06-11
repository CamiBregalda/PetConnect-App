import { Schema, model, Types } from "mongoose";
import { Endereco, EnderecoSchema } from "./Endereco";

export interface AbandonoAttributes {
    id?: string;
    userId: Types.ObjectId;
    local: Endereco;
    descricao: string;
    animalResgatado: boolean;
    idAbrigoResgatou?: Types.ObjectId;
    image?: Buffer;
    ativo?: boolean; 
    createdAt?: Date;
    updatedAt?: Date;
}

const AbandonoSchema = new Schema<AbandonoAttributes>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        local: { type: EnderecoSchema, required: true },
        descricao: { type: String, required: true },
        animalResgatado: { type: Boolean, required: true },
        idAbrigoResgatou: { type: Schema.Types.ObjectId, ref: 'Abrigo', required: false },
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: false },
    },
    {
        collection: "abandono",
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

const AbandonoModel = model<AbandonoAttributes>("Abandono", AbandonoSchema);
export default AbandonoModel;