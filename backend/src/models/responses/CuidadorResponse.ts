export class CuidadorResponse {
    id?: string;
    nome?: string;
    email?: string;
    idade?: number;
    ocupacao?: string;
    telefone?: string;
    endereco?: string;
    abrigoId?: string;
    userid?: string;

    constructor(props: {
        id?: string;
        nome?: string;
        email?: string;
        idade?: number;
        ocupacao?: string;
        telefone?: string;
        endereco?: string;
        abrigoId?: string;
        userId?: string;
    }) {
        Object.assign(this, props);
    }

    static fromEntities(cuidador: any) {
        return new CuidadorResponse({
            id: cuidador.id,
            nome: cuidador.userId.nome,
            email: cuidador.userId.email,
            idade: cuidador.userId.idade,
            ocupacao: cuidador.userId.ocupacao,
            telefone: cuidador.userId.telefone,
            endereco: cuidador.userId.endereco,
            abrigoId: cuidador.abrigoId,
            userId: cuidador.userId.id,
        });
    }
}
