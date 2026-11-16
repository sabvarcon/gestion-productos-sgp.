import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

try {
  await connectDB();
  app.listen(PORT, () => console.log(`Servidor disponible en http://localhost:${PORT}`));
} catch (error) {
  console.error('No fue posible iniciar la aplicación:', error.message);
  process.exit(1);
}
