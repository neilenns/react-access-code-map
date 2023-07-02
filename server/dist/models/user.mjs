import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
});
const userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    authStrategy: { type: String, default: "local" },
    refreshToken: { type: [Session] },
});
// Remove refreshToken from json responses for security
//Remove refreshToken from the response
userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken;
        return ret;
    },
});
userSchema.plugin(passportLocalMongoose);
export const User = model("User", userSchema);
//# sourceMappingURL=user.mjs.map