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

app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true, // allow cookies, authorization headers
}));

// app.use(
//   cors({
//     corsOption,
//   })
// );



import userRoute from "./Routes/user.route.js";
app.use("/api/auth/", userRoute);
