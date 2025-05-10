import { EspecieEnum } from '../models/enums/EspecieEnum';

export const getAllEspecies = () => {
    return Object.values(EspecieEnum);
};