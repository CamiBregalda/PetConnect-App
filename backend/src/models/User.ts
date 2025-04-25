import { Schema, model } from "mongoose";

export interface UserAttributes {
    nome: string;
    email: string;
    idade: number;
    telefone: string;
    endereco: string;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<UserAttributes>(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        idade: { type: Number, required: true },
        telefone: { type: String, required: true },
        endereco: { type: String, required: true },
        ativo: { type: Boolean, required: true },
    },
    {
        collection: "users",
        timestamps: true, 
    }
);

const UserModel = model<UserAttributes>("User", UserSchema);
export default UserModel;
