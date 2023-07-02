import { Schema, model } from "mongoose";
const locationSchema = new Schema({
    title: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    note: { type: String },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    created: { type: Date, required: true },
    modifiedBy: { type: Schema.Types.ObjectId, required: true },
    lastModified: { type: Date, required: true },
});
export const Location = model("Location", locationSchema);
//# sourceMappingURL=location.mjs.map