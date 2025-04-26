import { Schema, model } from "mongoose";

export interface CandidaturaAttributes {
    idCandidatura?: string;
    idAbrigo: string;
    cargo: string;
    curriculo: string;
    aprovacao: boolean;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const CandidaturaSchema = new Schema<CandidaturaAttributes>(
    {
        idCandidatura: { type: String },
        idAbrigo: { type: String, required: true },
        cargo: { type: String, required: true },
        curriculo: { type: String, required: true },
        aprovacao: { type: Boolean, required: true },
        ativo: { type: Boolean, required: true },
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