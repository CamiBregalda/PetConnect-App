import { Endereco } from "../models/Endereco";

export interface Coordenadas {
    latitude: string;
    longitude: string;
}

export async function getCoordenadasPeloEndereco(endereco: Endereco): Promise<Coordenadas> {
    const apiKey = process.env.LOCATION_IQ_TOKEN;

    if (!apiKey) {
        throw new Error("Chave da API LocationIQ não definida.");
    }

    const enderecoCompleto = `${endereco.numero}, ${endereco.cidade}, ${endereco.estado}, ${endereco.cep}`;
    const encodedEndereco = encodeURIComponent(enderecoCompleto);
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodedEndereco}&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Endereço não encontrado na API LocationIQ.");
    }

    return {
        latitude: data[0].lat,
        longitude: data[0].lon
    };
}
