export class AdmDeAbrigoResponse {
    id?: string;
    nome?: string;
    email?: string;
    idade?: number;
    ocupacao?: string;
    telefone?: string;
    endereco?: string;
    descricao?: string;
    userid?: string;

    constructor(props: {
        id?: string;
        nome?: string;
        email?: string;
        idade?: number;
        ocupacao?: string;
        telefone?: string;
        endereco?: string;
        descricao?: string;
        userId?: string;
    }) {
        Object.assign(this, props);
    }

    static fromEntities(adm: any) {
        return new AdmDeAbrigoResponse({
            id: adm.id,
            nome: adm.userId.nome,
            email: adm.userId.email,
            telefone: adm.userId.telefone,
            endereco: adm.userId.endereco,
            idade: adm.userId.idade,
            ocupacao: adm.userId.ocupacao,
            descricao: adm.descricao,
            userId: adm.userId.id,
        });
    }
}
