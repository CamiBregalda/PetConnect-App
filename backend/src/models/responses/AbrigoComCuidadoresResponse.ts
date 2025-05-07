import { CuidadorAttributes } from "../Cuidador";


export class AbrigoComCuidadoresResponse {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    abrigoId?: string;
    ativo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    cuidadores: CuidadorAttributes[];

    constructor(props: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        abrigoId?: string;
        ativo: boolean;
        createdAt?: Date;
        updatedAt?: Date;
        cuidadores: CuidadorAttributes[];
    }) {
        Object.assign(this, props);
    }

    static fromEntities(abrigo: any, cuidadores: CuidadorAttributes[]) {
        return new AbrigoComCuidadoresResponse({
            id: abrigo.id,
            nome: abrigo.nome,
            email: abrigo.email,
            telefone: abrigo.telefone,
            abrigoId: abrigo.abrigoId,
            ativo: abrigo.ativo,
            createdAt: abrigo.createdAt!,
            updatedAt: abrigo.updatedAt!,
            cuidadores,
        });
    }
}