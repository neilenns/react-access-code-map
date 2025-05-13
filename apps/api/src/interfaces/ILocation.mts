import { Types } from "mongoose";
import { IUser } from "./IUser.mjs";

export default interface ILocation {
  title?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  createdBy?: Types.ObjectId | IUser;
  created?: Date;
  modifiedBy?: Types.ObjectId | IUser;
  lastModified?: Date;
  modifiedByFirstName?: string;
  modifiedByLastName?: string;
  _id?: Types.ObjectId;
  hasToilet?: boolean;
}
