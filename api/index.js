import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`mongoDb connected successfully`);
  })
  .catch(error => {
    console.log(error);
  });
const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

//error middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`.cyan.underline);
});
