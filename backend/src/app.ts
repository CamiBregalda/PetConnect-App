import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import abrigoRoutes from './routes/abrigoRoutes';
import animaisRoutes from './routes/animalRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/abrigos', abrigoRoutes);
app.use('/animais', animaisRoutes);

export default app;
