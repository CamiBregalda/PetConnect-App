import express from 'express';
import userRoutes from './routes/userRoutes';
import abrigoRoutes from './routes/abrigoRoutes';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/abrigos', abrigoRoutes);

export default app;
