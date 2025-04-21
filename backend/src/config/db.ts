import { Sequelize, Dialect } from 'sequelize';
import UserFactory from '../models/User';
import AbrigoFactory from '../models/Abrigo';
import CandidaturaFactory from '../models/Candidatura';
import AnimalFactory from '../models/Animal';
import AdmDeAbrigoFactory from '../models/AdmDeAbrigo';
import VeterinarioFactory from '../models/Veterinario';
import CuidadorFactory from '../models/Cuidador';

const sequelize = new Sequelize('PetConnect-App', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres' as Dialect,
});

const db = {
    sequelize,
    Sequelize,
    User: UserFactory(sequelize),
    Abrigo: AbrigoFactory(sequelize),
    Candidatura: CandidaturaFactory(sequelize),
    Animal: AnimalFactory(sequelize),
    AdmDeAbrigo: AdmDeAbrigoFactory(sequelize),
    Veterinario: VeterinarioFactory(sequelize),
    Cuidador: CuidadorFactory(sequelize),
};

// ---- ASSOCIAÇÕES ---- //

// Abrigo tem muitos Cuidadores
db.Abrigo.hasMany(db.Cuidador, { foreignKey: 'abrigoId' });
db.Cuidador.belongsTo(db.Abrigo, { foreignKey: 'abrigoId' });

// Abrigo tem muitos Veterinarios
db.Abrigo.hasMany(db.Veterinario, { foreignKey: 'abrigoId' });
db.Veterinario.belongsTo(db.Abrigo, { foreignKey: 'abrigoId' });

// Abrigo tem um Administrador
db.Abrigo.belongsTo(db.AdmDeAbrigo, { foreignKey: 'idAdmAbrigo' });
db.AdmDeAbrigo.hasOne(db.Abrigo, { foreignKey: 'idAdmAbrigo' });

// Abrigo tem muitas Candidaturas
db.Abrigo.hasMany(db.Candidatura, { foreignKey: 'idAbrigo' });
db.Candidatura.belongsTo(db.Abrigo, { foreignKey: 'idAbrigo' });

export default db;