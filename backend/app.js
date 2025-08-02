import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

const corsOption = {
  origin: process.env.CORS_ORIGIN,
};

app.use(
  cors({
    corsOption,
  })
);



import userRoute from "./Routes/user.route.js";
app.use("/api/auth/", userRoute);
