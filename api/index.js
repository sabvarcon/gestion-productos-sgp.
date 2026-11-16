import 'dotenv/config';
import app from '../src/app.js';
import { connectDB } from '../src/config/database.js';

let connectionPromise;
export default async function handler(req, res) {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  await connectionPromise;
  return app(req, res);
}
