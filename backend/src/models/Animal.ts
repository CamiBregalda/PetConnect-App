import { Schema, model } from "mongoose";

export interface AnimalAttributes {
    id?: string;
    nome: string;
    sexo: string;
    dataNascimento: Date;
    especie: string;
    raca: string;
    porte: string;
    castrado: boolean;
    doencas: string[];
    deficiencias: string[];
    informacoes: string;
    vacinas: string[];
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const AnimalSchema = new Schema<AnimalAttributes>(
    {
        nome: { type: String, required: true },
        sexo: { type: String, required: true },
        dataNascimento: { type: Date, required: true },
        especie: { type: String, required: true },
        raca: { type: String, required: true },
        porte: { type: String, required: true },
        castrado: { type: Boolean, required: true },
        doencas: { type: [String], required: true },
        deficiencias: { type: [String], required: true },
        informacoes: { type: String, required: true },
        vacinas: { type: [String], required: true },
        ativo: { type: Boolean, required: true },
    },
    {
        collection: "animais",
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

const AnimalModel = model<AnimalAttributes>("Animal", AnimalSchema);
export default AnimalModel;