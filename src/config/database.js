import mongoose from 'mongoose';

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('La variable MONGODB_URI no está configurada.');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Conexión con MongoDB establecida.');
  return mongoose.connection;
}
