import app from './app';
import { connectDatabase } from "./config/database";

const PORT = 3000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
