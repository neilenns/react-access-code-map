import { Schema, model, Types } from "mongoose";

// Define the interface for the Location document
export interface ILocation {
  title: string;
  latitude: number;
  longitude: number;
  note: string;
  createdBy: Types.ObjectId;
  created: Date;
  modifiedBy: Types.ObjectId;
  lastModified: Date;
}

const locationSchema = new Schema<ILocation>({
  title: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  note: { type: String },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, required: true },
  modifiedBy: { type: Schema.Types.ObjectId, required: true },
  lastModified: { type: Date, required: true },
});

export const Location = model<ILocation>("Location", locationSchema);
