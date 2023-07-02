import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});
userSchema.plugin(passportLocalMongoose);
export const User = model("User", userSchema);
//# sourceMappingURL=user.mjs.map