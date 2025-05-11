import { Schema, model } from "mongoose";
import { Endereco, EnderecoSchema } from "./Endereco";

export interface UserAttributes {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco?: Endereco;
    idade?: number;
    ocupacao?: string;
    image?: Buffer;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<UserAttributes>(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        cpf: { type: String, required: true },
        telefone: { type: String, required: true },
        endereco: { type: EnderecoSchema, required: false },
        idade: { type: Number, required: false },
        ocupacao: { type: String, required: false },
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: true },
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
