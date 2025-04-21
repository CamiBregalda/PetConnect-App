import { Schema, model } from "mongoose";

export interface CuidadorAttributes {
    nome: string;
    email: string;
    telefone: string;
    abrigoId?: string;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const CuidadorSchema = new Schema<CuidadorAttributes>(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        telefone: { type: String, required: true },
        abrigoId: { type: String, required: true },
        ativo: { type: Boolean, required: true },
    },
    {
        collection: "cuidadores",
        timestamps: true,
    }
);

const CuidadorModel = model<CuidadorAttributes>("Cuidador", CuidadorSchema);
export default CuidadorModel;