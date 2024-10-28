import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js";
import postRouter from "./Routes/postRouter.js";
import messageRoutes from "./Routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
app.use(express.json({ limit: "50mb" })); //to parse JSON date in the req.body
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //to parse from data in the req.body

//Routers
app.use("/api/user", userRoutes);
app.use("/api/post", postRouter);
app.use("/api/message", messageRoutes);

server.listen(5000, () => {
  console.log(`server started at ${PORT} port`);
});
