import { Schema, model } from "mongoose";

export interface AbrigoAttributes {
    id?: string;
    cnpj: string;
    nome: string;
    email: string;
    endereco: string;
    telefone: string;
    descricao?: string;
    idAdmAbrigo: string;
    avaliacao?: string;
    cuidadores?: string[];
    candidaturas?: string[];
    image?: Buffer;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const AbrigoSchema = new Schema<AbrigoAttributes>(
    {
        cnpj: { type: String, required: true },
        nome: { type: String, required: true },
        email: { type: String, required: true },
        endereco: { type: String, required: true },
        telefone: { type: String, required: true },
        descricao: { type: String, required: false },
        idAdmAbrigo: { type: String, required: true },
        avaliacao: { type: String, required: false },
        cuidadores: { type: [String], required: false },
        candidaturas: { type: [String], required: false },
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: true },
    },
    {
        collection: "abrigos",
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

const AbrigoModel = model<AbrigoAttributes>("Abrigo", AbrigoSchema);
export default AbrigoModel;