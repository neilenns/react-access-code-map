import mongoose from "mongoose";

const dbUrl =
  process.env.MONGO_CONNECTION_STRING ??
  "mongodb://admin:admin@tom:28018/?retryWrites=true&w=majority"; // Replace with your MongoDB connection string
const dbName = "access-code-map"; // Replace with your database name

export async function connectToDatabase(): Promise<void> {
  mongoose.set("bufferCommands", false);
  try {
    await mongoose.connect(dbUrl, {
      dbName: dbName,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

export { dbUrl, dbName };
