// api/lib/db.js
// Production-grade MongoDB connection manager with serverless connection pooling
import mongoose from "mongoose";
import { config } from "./config.js";

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

/**
 * Connects to MongoDB with connection caching across serverless invocations.
 * Gracefully degrades if MONGODB_URI is missing or database is temporarily unreachable.
 */
export async function connectToDatabase() {
  if (!config.mongodbUri) {
    // Graceful fallback: do not throw or crash portfolio
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    };

    cached.promise = mongoose
      .connect(config.mongodbUri, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("[Analytics DB] MongoDB connection failed:", err.message);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.warn("[Analytics DB] Unexpected connection error:", error.message);
    cached.promise = null;
    return null;
  }
}

