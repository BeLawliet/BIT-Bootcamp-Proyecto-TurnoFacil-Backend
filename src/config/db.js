import mongoose from 'mongoose';

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI no está configurada.');
  }

  const databaseName = new URL(uri).pathname.slice(1) || 'db_turno_facil';
  await mongoose.connect(uri, { dbName: databaseName });
}
