import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRoutes from "./routes/userRoutes";
import { connectDB } from "./db/db";

const app = express();
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
