import { Schema, model } from "mongoose";
import { EspecieEnum } from './enums/EspecieEnum';
import { RacasPorEspecieRecord } from './enums/RacasPorEspecieRecord';
import { Porte } from './enums/PorteEnum';

export interface AnimalAttributes {
    id?: string;
    nome: string;
    sexo: string;
    dataNascimento?: Date;
    especie: EspecieEnum;
    raca: String;
    porte: Porte;
    castrado: boolean;
    doencas: string[];
    deficiencias: string[];
    informacoes: string;
    vacinas: string[];
    idDono: string;
    adotado: boolean;
    image?: Buffer;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const AnimalSchema = new Schema<AnimalAttributes>(
    {
        nome: { type: String, required: true },
        sexo: { type: String, required: true },
        dataNascimento: { type: Date, required: false },
        especie: { type: String, enum: Object.values(EspecieEnum), required: true },
        raca: { type: String, required: true },
        porte: { type: String, enum: Object.values(Porte), required: true },
        castrado: { type: Boolean, required: true },
        doencas: { type: [String], required: true },
        deficiencias: { type: [String], required: true },
        vacinas: { type: [String], required: true },
        informacoes: { type: String, required: true },
        idDono: { type: String, required: true },
        adotado: { type: Boolean, required: true },
        image: { type: Buffer, required: false },
        ativo: { type: Boolean, required: false },
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

                if (ret.dataNascimento instanceof Date && !isNaN(ret.dataNascimento.getTime())) {
                    const date = new Date(ret.dataNascimento);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    ret.dataNascimento = `${day}/${month}/${year}`;
                } else {
                    ret.dataNascimento = "Data desconhecida";
                }
            }
        }
    }
);

const AnimalModel = model<AnimalAttributes>("Animal", AnimalSchema);
export default AnimalModel;