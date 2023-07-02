import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// Define the interface for the Location document
export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

userSchema.plugin(passportLocalMongoose);

export const User = model<IUser>("User", userSchema);
