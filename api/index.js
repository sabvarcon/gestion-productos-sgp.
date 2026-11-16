import 'dotenv/config';
import app from '../src/app.js';
import { connectDB } from '../src/config/database.js';

let connectionPromise;

export default async function handler(req, res) {
  try {
    if (!connectionPromise) {
      connectionPromise = connectDB().catch((error) => {
        connectionPromise = null;
        throw error;
      });
    }
    await connectionPromise;
    return app(req, res);
  } catch (error) {
    console.error('Error al iniciar la API o conectar con MongoDB:', error);
    if (res.headersSent) return;
    return res.status(503).json({
      message: 'Servicio temporalmente no disponible. Verifica la configuración de MongoDB y las variables de entorno.',
      ...(process.env.NODE_ENV !== 'production' ? { detail: error.message } : {})
    });
  }
}
