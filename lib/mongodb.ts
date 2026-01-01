import mongoose from "mongoose";

import { MongoClient } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGO_DB_SERVER) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.NEXT_PUBLIC_MONGO_DB_SERVER;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    mongoose?: typeof mongoose;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function connectMongoDB() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(uri);
      console.log("Mongoose connected successfully");
    } catch (error) {
      console.error("Mongoose connection error:", error);
      throw error;
    }
  }
  const client = await clientPromise;
  const db = client.db();
  return { db, client };
}
