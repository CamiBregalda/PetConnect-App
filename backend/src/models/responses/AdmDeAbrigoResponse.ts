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
            id: adm.id ?? null,
            nome: adm.userId.nome ?? null,
            email: adm.userId.email ?? null,
            idade: adm.userId.idade ?? null,
            telefone: adm.userId.telefone ?? null,
            endereco: adm.userId.endereco ?? null,
            descricao: adm.descricao ?? null,
            userId: adm.userId.id ?? null,
        });
    }
}
