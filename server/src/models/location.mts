import { Schema, model, Types } from "mongoose";
import { IUser } from "./user.mjs";

// Define the interface for the Location document
export interface ILocation {
  title: string;
  latitude: number;
  longitude: number;
  note: string;
  createdBy: Types.ObjectId | IUser;
  created: Date;
  modifiedBy: Types.ObjectId | IUser;
  lastModified: Date;
}

const locationSchema = new Schema<ILocation>({
  title: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  note: { type: String },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, required: true },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastModified: { type: Date, required: true },
});

export const Location = model<ILocation>("Location", locationSchema);
