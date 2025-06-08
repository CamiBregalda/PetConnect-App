import { Schema, model, Types } from "mongoose";

export interface AdmDeAbrigoAttributes {
    userId: Types.ObjectId;
    descricao?: string;
    ativo?: boolean;
    abrigo?: Types.ObjectId; 
    createdAt?: Date;
    updatedAt?: Date;
}

const AdmDeAbrigoSchema = new Schema<AdmDeAbrigoAttributes>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        descricao: { type: String, required: false },
        ativo: { type: Boolean, required: false },
        abrigo: { type: Schema.Types.ObjectId, ref: 'Abrigo', required: false }, 
    },
    {
        collection: "adm_de_abrigos",
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

const AdmDeAbrigoModel = model<AdmDeAbrigoAttributes>("AdmDeAbrigo", AdmDeAbrigoSchema);
export default AdmDeAbrigoModel;