import { AbrigoAttributes } from "../Abrigo";

export class AdmDeAbrigoWithAbrigoResponse {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
    descricao?: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
    abrigo: AbrigoAttributes;

    constructor(props: {
        id: string;
        nome: string;
        telefone: string;
        email: string;
        endereco: string;
        descricao?: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        abrigo: AbrigoAttributes;
    }) {
        Object.assign(this, props);
    }

    static fromEntities(admDeAbrigo: any, abrigo: AbrigoAttributes) {
        return new AdmDeAbrigoWithAbrigoResponse({
            id: admDeAbrigo.id,
            nome: admDeAbrigo.nome,
            telefone: admDeAbrigo.telefone,
            email: admDeAbrigo.email,
            endereco: admDeAbrigo.endereco,
            descricao: admDeAbrigo.descricao,
            ativo: admDeAbrigo.ativo,
            createdAt: admDeAbrigo.createdAt,
            updatedAt: admDeAbrigo.updatedAt,
            abrigo
        });
    }
}