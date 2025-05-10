export class AdmDeAbrigoResponse {
    id?: string;
    nome?: string;
    email?: string;
    idade?: number;
    telefone?: string;
    endereco?: string;
    descricao?: string;
    userid?: string;

    constructor(props: {
        id?: string;
        nome?: string;
        email?: string;
        idade?: number;
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
            idade: adm.userId.idade,
            telefone: adm.userId.telefone,
            endereco: adm.userId.endereco,
            descricao: adm.descricao,
            userId: adm.userId.id,
        });
    }
}
