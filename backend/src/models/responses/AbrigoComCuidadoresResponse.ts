import { CuidadorAttributes } from "../Cuidador";
import { CuidadorResponse } from "./CuidadorResponse";


export class AbrigoComCuidadoresResponse {
    id?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    abrigoId?: string;
    ativo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    cuidadores?: CuidadorResponse[];

    constructor(props: {
        id?: string;
        nome?: string;
        email?: string;
        telefone?: string;
        abrigoId?: string;
        ativo?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
        cuidadores?: CuidadorResponse[];
    }) {
        Object.assign(this, props);
    }

    static fromEntities(abrigo: any, cuidadores: CuidadorResponse[]) {
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