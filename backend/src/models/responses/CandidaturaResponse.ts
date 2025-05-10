export class CandidaturaResponse {
    id?: string;
    nome?: string;
    email?: string;
    idade?: number;
    ocupacao?: string;
    telefone?: string;
    endereco?: string;
    userid?: string;
    abrigoId?: string;
    cargo?: string;
    curriculo?: string;
    aprovacao?: boolean;
    ativo?: boolean;

    constructor(props: {
        id?: string;
        nome?: string;
        email?: string;
        idade?: number;
        ocupacao?: string;
        telefone?: string;
        endereco?: string;
        userId?: string;
        abrigoId?: string;
        cargo?: string;
        curriculo?: string;
        aprovacao?: boolean;
        ativo?: boolean;
    }) {
        Object.assign(this, props);
    }

    static fromEntities(candidatura: any) {
        return new CandidaturaResponse({
            id: candidatura.id,
            nome: candidatura.userId.nome,
            email: candidatura.userId.email,
            telefone: candidatura.userId.telefone,
            endereco: candidatura.userId.endereco,
            idade: candidatura.userId.idade,
            ocupacao: candidatura.userId.ocupacao,
            userId: candidatura.userId.id,
            abrigoId: candidatura.abrigoId,
            cargo: candidatura.cargo,
            curriculo: candidatura.curriculo,
            aprovacao: candidatura.aprovacao,
            ativo: candidatura.ativo,
        });
    }
}
