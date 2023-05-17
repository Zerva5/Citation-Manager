import express, { Express, Request, Response } from "express";
import mongoose, { Document, Schema, Model, model, Error } from "mongoose";
import dotenv from "dotenv";
import Auth from "./Auth";
import {PublicRouting, AccessProtectedRouting, RefreshProtectedRouting} from "./Routing";
import { TokenAuth } from "./TokenAuth";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/citman", {
      authSource: "admin",
      user: "api",
      pass: "api_pass",
    });
    console.log("MongoDB is connected...");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}

function StartExpress(){
  console.log("Starting Express...");
  const app: Express = express();
  const port = process.env.PORT;
  app.use(express.json());

  const accessProtectedRouting = AccessProtectedRouting();
  const publicRouting = PublicRouting();
  const refreshProtectedRouting = RefreshProtectedRouting();


  accessProtectedRouting.use(TokenAuth.authenticateAccessToken);
  refreshProtectedRouting.use(TokenAuth.authenticateRefreshToken);


  app.use("/public", publicRouting);
  app.use("/protected", accessProtectedRouting);
  app.use("/refresh", refreshProtectedRouting);


  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });


}

export default function API() {
  dotenv.config();

  connectDB();

  StartExpress()

  return true;
}