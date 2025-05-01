import { env } from "@/lib/env";
import mongoose from "mongoose";

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      };
    }
  }
}

interface GlobalWithMongoose extends NodeJS.Global {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = (global as unknown as GlobalWithMongoose).mongoose;

if (!cached) {
  cached = (global as unknown as GlobalWithMongoose).mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      user: env.MONGO_INITDB_ROOT_USERNAME,
      pass: env.MONGO_INITDB_ROOT_PASSWORD,
      authSource: env.MONGO_INITDB_DATABASE,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export async function checkMongoConnection() {
  try {
    await dbConnect();
    const isConnected = mongoose.connection.readyState === 1;
    console.log(
      `MongoDB connection status: ${isConnected ? "Connected" : "Disconnected"}`
    );
    return isConnected;
  } catch (error) {
    console.error("MongoDB connection check failed:", error);
    return false;
  }
}

export async function closeMongoConnection() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    return true;
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    return false;
  }
}

export default dbConnect;
