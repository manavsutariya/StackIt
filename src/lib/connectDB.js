import mongoose from 'mongoose';
import errorService from '@/utils/errorService.js'; // ✅ make sure this path is correct

// 🔁 Global caching to avoid multiple connections during dev hot reload
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  // ✅ Missing MongoDB URI
  if (!MONGODB_URI) {
    const error = errorService.createError
      .setErrorType("CONFIG_ERROR")
      .setStatus(500)
      .setCode("MONGODB_URI_MISSING")
      .setMessage("Missing MongoDB connection string in environment variables.")
      .addContext("module", "connectDB")
      .addContext("function", "connectDB")
      .build();

    throw error;
  }

  // ✅ Use cached connection if already available
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log('✅ MongoDB successfully connected');
        return mongoose;
      })
      .catch((err) => {
        const error = errorService.createError
          .setErrorType("DB_CONNECTION_ERROR")
          .setStatus(500)
          .setCode("MONGODB_CONNECTION_FAILED")
          .setMessage("Failed to connect to MongoDB.")
          .addContext("module", "connectDB")
          .addContext("function", "connectDB")
          .build();

        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
