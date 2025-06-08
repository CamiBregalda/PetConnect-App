import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
