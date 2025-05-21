import { Schema, model } from "mongoose";
import { Endereco, EnderecoSchema } from "./Endereco";

export interface UserAttributes {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
    endereco: Endereco;
    idade?: number;
    ocupacao?: string;
    descricao?: string;
    image?: Buffer;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<UserAttributes>(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        senha: { type: String, required: true },
        cpf: { type: String, required: true },
        telefone: { type: String, required: true },
        endereco: { type: EnderecoSchema, required: true },
        idade: { type: Number, required: false },
        ocupacao: { type: String, required: false },
        descricao: { type: String, required: false },
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: false },
    },
    {
        collection: "users",
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

const UserModel = model<UserAttributes>("User", UserSchema);
export default UserModel;
