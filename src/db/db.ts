import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB  connection error:", error);
    process.exit(1);
  }
};
