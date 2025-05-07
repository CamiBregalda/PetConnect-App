    import { AnimalAttributes } from "../Animal";

    export class AbrigoComAnimaisResponse {
        id: string;
        cnpj: string;
        nome: string;
        email: string;
        endereco: string;
        telefone: string;
        descricao?: string;
        idAdmAbrigo: string;
        avaliacao?: string;
        cuidadores?: string[];
        candidaturas?: string[];
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        animais: AnimalAttributes[];

        constructor(props: {
            id: string;
            cnpj: string;
            nome: string;
            email: string;
            endereco: string;
            telefone: string;
            descricao?: string;
            idAdmAbrigo: string;
            avaliacao?: string;
            cuidadores?: string[];
            candidaturas?: string[];
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            animais: AnimalAttributes[];
        }) {
            Object.assign(this, props);
        }

        static fromEntities(abrigo: any, animais: AnimalAttributes[]) {
            return new AbrigoComAnimaisResponse({
                id: abrigo.id!,
                cnpj: abrigo.cnpj,
                nome: abrigo.nome,
                email: abrigo.email,
                endereco: abrigo.endereco,
                telefone: abrigo.telefone,
                descricao: abrigo.descricao,
                idAdmAbrigo: abrigo.idAdmAbrigo,
                avaliacao: abrigo.avaliacao,
                cuidadores: abrigo.cuidadores,
                candidaturas: abrigo.candidaturas,
                ativo: abrigo.ativo,
                createdAt: abrigo.createdAt!,
                updatedAt: abrigo.updatedAt!,
                animais,
            });
        }
    }