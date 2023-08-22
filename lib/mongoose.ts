import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (!process.env.MONGODB_URL) {
    return console.log("MONGODB_URL not found");
  }

  if (isConnected) {
    return console.log("Already connected");
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
