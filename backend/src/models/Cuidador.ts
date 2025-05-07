import { Schema, model } from "mongoose";
import { UserAttributes } from "./User";

export interface CuidadorAttributes {
    nome: string;
    email: string;
    telefone?: string;
    abrigoId?: string;
    image?: Buffer;
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
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: true },
    },
    {
        collection: "cuidadores",
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

const CuidadorModel = model<CuidadorAttributes>("Cuidador", CuidadorSchema);
export default CuidadorModel;

export class CuidadorFactory {
    static createFromUser(user: UserAttributes, abrigoId: string) {
        return new CuidadorModel({
            nome: user.nome,
            email: user.email,
            telefone: user.telefone,
            image: user.image,
            abrigoId,
            ativo: true,
        });
    }
}