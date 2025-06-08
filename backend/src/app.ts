import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import abrigoRoutes from './routes/abrigoRoutes';
import animaisRoutes from './routes/animalRoutes';
import AdmDeAbrigoRoutes from './routes/admDeAbrigoRoutes';
import cuidadorRoutes from './routes/cuidadorRoutes';
import eventoRoutes from './routes/eventoRoutes';
import abandonoRoutes from './routes/abandonoRoutes';
import candidaturaRoutes from './routes/candidaturaRoutes';
import especieRoutes from './routes/especieRoutes';
import porteRoutes from './routes/porteRoutes';
import enderecoRoutes from './routes/enderecoRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/admAbrigo', AdmDeAbrigoRoutes);
app.use('/abrigos', abrigoRoutes);
app.use('/animais', animaisRoutes);
app.use('/cuidadores', cuidadorRoutes);
app.use('/eventos', eventoRoutes);
app.use('/abandonos', abandonoRoutes);
app.use('/candidaturas', candidaturaRoutes);
app.use('/especies', especieRoutes);
app.use('/portes', porteRoutes);
app.use('/geocode', enderecoRoutes);

app.use('/animais', especieRoutes);
app.use('/animais', porteRoutes);
app.use('/animais', animaisRoutes); 

export default app;
