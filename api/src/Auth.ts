import { Document, Model, Schema, model } from "mongoose";
import { IProject } from "./Project";
import bcrypt from "bcryptjs";

// User class and db interface declarations and mongoose schema
export interface IAuth extends Document {
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const AuthSchema = new Schema<IAuth>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

AuthSchema.pre<IAuth>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

AuthSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const Auth: Model<IAuth> = model("Auth", AuthSchema);
export default Auth;
