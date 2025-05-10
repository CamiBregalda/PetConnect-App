import { AbrigoAttributes } from "../Abrigo";

export class AdmDeAbrigoWithAbrigoResponse {
    id?: string;
    nome?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    descricao?: string;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    abrigo?: AbrigoAttributes;

    constructor(props: {
        id?: string;
        nome?: string;
        telefone?: string;
        email?: string;
        endereco?: string;
        descricao?: string;
        ativo?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
        abrigo?: AbrigoAttributes;
    }) {
        Object.assign(this, props);
    }

    static fromEntities(admDeAbrigo: any, abrigo: AbrigoAttributes) {
        return new AdmDeAbrigoWithAbrigoResponse({
            id: admDeAbrigo.id,
            nome: admDeAbrigo.userId.nome,
            telefone: admDeAbrigo.userId.telefone,
            email: admDeAbrigo.userId.email,
            endereco: admDeAbrigo.userId.endereco,
            descricao: admDeAbrigo.descricao,
            ativo: admDeAbrigo.userId.ativo,
            createdAt: admDeAbrigo.userId.createdAt,
            updatedAt: admDeAbrigo.userId.updatedAt,
            abrigo
        });
    }
}