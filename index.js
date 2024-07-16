import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 
const FRONTEND_ENV = process.env.FRONTEND_ENV 

app.use(
  cors({
    origin: FRONTEND_ENV,  
    credentials: true,
    
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err);

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
