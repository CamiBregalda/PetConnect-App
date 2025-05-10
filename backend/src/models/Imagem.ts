import { Schema } from "mongoose";

export interface Imagem {
    name: string;
    image: Buffer;
}

export const ImagemSchema = new Schema<Imagem>(
    {
        name: { type: String, required: true },
        image: { type: Buffer, required: true },
    },
    { _id: false }
);