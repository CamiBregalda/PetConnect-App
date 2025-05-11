import { Schema, model, Types } from "mongoose";

export interface CandidaturaAttributes {
    abrigoId: Types.ObjectId;
    userId: Types.ObjectId;
    cargo: string;
    curriculo: string;
    aprovacao: boolean;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const CandidaturaSchema = new Schema<CandidaturaAttributes>(
    {
        abrigoId: { type: Schema.Types.ObjectId, ref: 'Abrigo', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        cargo: { type: String, required: true },
        curriculo: { type: String, required: true },
        aprovacao: { type: Boolean, required: true },
        ativo: { type: Boolean, required: false },
    },
    {
        collection: "candidaturas",
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

const CandidaturaModel = model<CandidaturaAttributes>("Candidatura", CandidaturaSchema);
export default CandidaturaModel;