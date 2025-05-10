import { Porte } from '../models/enums/PorteEnum';

export const getPortes = () => {
    return Object.values(Porte);
};
