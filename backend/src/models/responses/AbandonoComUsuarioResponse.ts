import { AbandonoAttributes } from "../Abandono";
import { Endereco, EnderecoSchema } from "../Endereco";
import { UserAttributes } from "../User";

export class AbandonoComUsuarioResponse {
    id?: string;
    emailUser?: string;
    local?: Endereco;
    descricao?: string;
    animalResgatado?: boolean;
    idAbrigoResgatou?: string;
    usuario?: UserAttributes;

    constructor(props: {
        id: string;
        emailUser: string;
        local: Endereco;
        descricao: string;
        animalResgatado: boolean;
        idAbrigoResgatou?: string;
        usuario?: UserAttributes;
    }) {
        Object.assign(this, props);
    }

    static fromEntities(abandono: any, usuario: UserAttributes) {
        return new AbandonoComUsuarioResponse({
            id: abandono.id!,
            emailUser: usuario.email,
            local: abandono.local,
            descricao: abandono.descricao,
            animalResgatado: abandono.animalResgatado,
            idAbrigoResgatou: abandono.idAbrigoResgatou,
            usuario
        });
    }
}