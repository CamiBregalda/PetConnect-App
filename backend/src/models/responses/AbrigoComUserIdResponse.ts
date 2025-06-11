import { Endereco } from "../Endereco";

export class AbrigoComUserIdResponse {
    id?: string;
    nome?: string;
    email?: string;
    cnpj?: string;
    descricao?: string;
    telefone?: string;
    abrigoId?: string;
    idAdmAbrigo?: string;
    userId?: string;
    endereco?: Endereco;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    cuidadores?: string[];
    candidaturas?: string[];

    constructor(props: {
        id?: string;
        nome?: string;
        email?: string;
        telefone?: string;
        cnpj?: string;
        descricao?: string;
        abrigoId?: string;
        idAdmAbrigo?: string;
        userId?: string;
        endereco?: Endereco;
        ativo?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
        cuidadores?: string[];
        candidaturas?: string[];
    }) {
        Object.assign(this, props);
    }

    static fromEntities(abrigo: any, userId: string) {
        return new AbrigoComUserIdResponse({
            id: abrigo.id,
            nome: abrigo.nome,
            email: abrigo.email,
            cnpj: abrigo.cnpj,
            descricao: abrigo.descricao,
            telefone: abrigo.telefone,
            abrigoId: abrigo.abrigoId,
            idAdmAbrigo: abrigo.idAdmAbrigo,
            userId: userId,
            endereco: abrigo.endereco,
            ativo: abrigo.ativo,
            cuidadores: abrigo.cuidadores,
            candidaturas: abrigo.candidaturas,
        });
    }
}