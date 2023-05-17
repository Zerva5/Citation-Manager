import { Document, Model, Schema, model } from "mongoose";
import { IProject } from "./Project";
import bcrypt from "bcryptjs";

// User class and db interface declarations and mongoose schema
export interface IUser extends Document {
  name: string;
  email: string;
  projects: IProject["_id"][];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});


export const User: Model<IUser> = model("User", UserSchema);

// export class User {
//   private _id: number;
//   private _name: string;
//   private _email: string;

//   constructor(id: number, name: string, email: string) {
//     this._id = id;
//     this._name = name;
//     this._email = email;
//   }

// }
