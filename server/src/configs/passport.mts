import passport from "passport";
import { User } from "../models/user.mjs";

export function configurePassport() {
  passport.use(User.createStrategy());

  passport.serializeUser(User.serializeUser() as any); // Work around a type error, see https://stackoverflow.com/questions/67726174/passport-local-mongoose-serializeuser-incorrect-type
  passport.deserializeUser(User.deserializeUser());
}
