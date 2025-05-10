import { Schema, model, Types } from "mongoose";
import { Endereco, EnderecoSchema } from "./Endereco";

export interface AbrigoAttributes {
    id?: string;
    cnpj: string;
    nome: string;
    email: string;
    endereco: Endereco;
    telefone: string;
    descricao?: string;
    idAdmAbrigo?: Types.ObjectId
    avaliacao?: string;
    cuidadores?: Types.ObjectId[];
    candidaturas?: Types.ObjectId[];
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
        endereco: { type: EnderecoSchema, required: true },
        telefone: { type: String, required: true },
        descricao: { type: String, required: false },
        idAdmAbrigo: { type: Schema.Types.ObjectId, ref: 'AdmDeAbrigo', required: true },
        avaliacao: { type: String, required: false },
        cuidadores: { type: [Schema.Types.ObjectId], ref: 'Cuidador', required: false },
        candidaturas: { type: [Schema.Types.ObjectId], ref: 'Candidatura', required: false },
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: false },
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