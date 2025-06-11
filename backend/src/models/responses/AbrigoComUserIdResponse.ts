export class AbrigoComUserIdResponse {
    id?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    abrigoId?: string;
    idAdmAbrigo?: string;
    userId?: string;
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
        abrigoId?: string;
        idAdmAbrigo?: string;
        userId?: string;
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
            telefone: abrigo.telefone,
            abrigoId: abrigo.abrigoId,
            idAdmAbrigo: abrigo.idAdmAbrigo,
            userId: userId,
            ativo: abrigo.ativo,
            cuidadores: abrigo.cuidadores,
            candidaturas: abrigo.candidaturas,
        });
    }
}