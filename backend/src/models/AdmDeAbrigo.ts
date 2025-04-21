import { Schema, model } from "mongoose";

export interface AdmDeAbrigoAttributes {
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const AdmDeAbrigoSchema = new Schema<AdmDeAbrigoAttributes>(
    {
        nome: { type: String, required: true },
        telefone: { type: String, required: true },
        email: { type: String, required: true },
        endereco: { type: String, required: true },
        ativo: { type: Boolean, required: true },
    },
    {
        collection: "adm_de_abrigos",
        timestamps: true,
    }
);

const AdmDeAbrigoModel = model<AdmDeAbrigoAttributes>("AdmDeAbrigo", AdmDeAbrigoSchema);
export default AdmDeAbrigoModel;