import { Schema, model } from "mongoose";

export interface AbrigoAttributes {
    id?: string;
    cnpj: string;
    nome: string;
    email: string;
    endereco: string;
    telefone: string;
    idAdmAbrigo: string;
    avaliacao: string;
    cuidadores: string[];
    veterinarios: string[];
    candidaturas: string[];
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
        idAdmAbrigo: { type: String, required: true },
        avaliacao: { type: String, required: true },
        cuidadores: { type: [String], required: true },
        veterinarios: { type: [String], required: true },
        candidaturas: { type: [String], required: true },
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