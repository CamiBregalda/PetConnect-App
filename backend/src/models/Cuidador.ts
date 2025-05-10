import { Schema, model, Types } from "mongoose";
import { UserAttributes } from "./User";

export interface CuidadorAttributes {
    email: string;
    userId: Types.ObjectId;
    abrigoId?: string;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const CuidadorSchema = new Schema<CuidadorAttributes>(
    {
        email: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        abrigoId: { type: String, required: true },
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
    static createFromUser(user: UserAttributes, userId: string, abrigoId: string) {
        return new CuidadorModel({
            email: user.email,
            userId,
            abrigoId,
            ativo: true,
        });
    }
}