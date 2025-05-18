import { EspecieEnum } from '../models/enums/EspecieEnum';
import { RacasPorEspecieRecord } from '../models/enums/RacasPorEspecieRecord';

export const getAllEspecies = () => {
    return Object.values(EspecieEnum);
};

export const getRacasByEspecie = (especie: string): string[] => {
    return RacasPorEspecieRecord[especie] || [];
};