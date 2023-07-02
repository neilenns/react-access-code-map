import express from "express";
import passport from "passport";
import { User } from "../models/user.mjs";

const router = express.Router();

function logout(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

router.post("/signup", function (req, res) {
  User.register(
    new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        res.json({
          success: false,
          message: "Your account could not be saved. Error: " + err,
        });
      } else {
        req.login(user, (er) => {
          if (er) {
            res.json({ success: false, message: er });
          } else {
            res.redirect("/");
          }
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), function (req, res) {
  // Successful login
  res.redirect("/");
});

router.get("/login", (req, res, next) => {
  res.redirect("/");
});

router.get("/signup", function (req, res, next) {
  res.redirect("/");
});

router.get("/logout", logout);
router.post("/logout", logout);

export default router;
