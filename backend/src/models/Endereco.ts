import { Schema } from "mongoose";

export interface Endereco {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export const EnderecoSchema = new Schema<Endereco>(
    {
        rua: { type: String, required: true },
        numero: { type: String, required: true },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        cep: { type: String, required: true },
    },
    { _id: false }
);
export class Endereco {
    constructor(
        public rua: string,
        public numero: string,
        public bairro: string,
        public cidade: string,
        public estado: string,
        public cep: string
    ) {}

    getEnderecoCompleto(): string {
        return `${this.rua}, ${this.numero}, ${this.bairro}, ${this.cidade} - ${this.estado}, ${this.cep}`;
    }
}