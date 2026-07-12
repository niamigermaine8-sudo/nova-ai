import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const mongoUri: string = MONGODB_URI;

const cached = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const connection = cached.mongoose;

  if (!connection) {
    throw new Error("MongoDB connection is not initialized");
  }

  if (connection.conn) {
    return connection.conn;
  }

  if (!connection.promise) {
    connection.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  connection.conn = await connection.promise;
  return connection.conn;
}
