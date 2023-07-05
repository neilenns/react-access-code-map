import { Types } from "mongoose";

export default interface ILocation {
  title?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  createdBy?: Types.ObjectId;
  created?: Date;
  modifiedBy?: Types.ObjectId;
  lastModified?: Date;
  modifiedByFirstName?: string;
  modifiedByLastName?: string;
  _id?: Types.ObjectId;
}
