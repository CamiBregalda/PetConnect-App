import { RacasPorEspecieRecord } from '../models/enums/RacasPorEspecieRecord';

export const getRacasByEspecie = (especie: string): string[] => {
    return RacasPorEspecieRecord[especie] || [];
};