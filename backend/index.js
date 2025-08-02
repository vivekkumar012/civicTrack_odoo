import {app} from "./app.js";
import { db } from "./utils/db.js";
import dotenv from "dotenv";
dotenv.config();
//api

db();

 app.listen(process.env.PORT || 8000, () => {
      console.log("Server is listening at ", process.env.PORT);
    });
  
//userApi

