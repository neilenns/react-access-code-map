import { Schema, model, Types } from "mongoose";
import { IUser } from "./user.mjs";
import autopopulate from "mongoose-autopopulate";

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
  hasToilet: boolean;
}

const locationSchema = new Schema<ILocation>({
  title: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  note: { type: String },
  hasToilet: { type: Boolean, default: false },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: {
      select: "firstName lastName",
    },
  },
  created: { type: Date, required: true },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: {
      select: "firstName lastName",
    },
  },
  lastModified: { type: Date, required: true },
});

locationSchema.plugin(autopopulate);

export const Location = model<ILocation>("Location", locationSchema);
