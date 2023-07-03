import express from "express";
import passport from "passport";
import { User } from "../models/user.mjs";
import { getAuthToken, COOKIE_OPTIONS, getRefreshToken, verifyUser, } from "../authenticate.mjs";
import jwt from "jsonwebtoken";
const router = express.Router();
function logout(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
}
router.post("/signup", function (req, res) {
    User.register(new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.send(err);
        }
        else {
            user.firstName = req.body.firstName || "";
            user.lastName = req.body.lastName || "";
            const authToken = getAuthToken({ _id: user._id });
            const refreshToken = getRefreshToken({ _id: user._id });
            user.refreshToken.push({ refreshToken });
            user
                .save()
                .then(() => {
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                res.send({ success: true, token: authToken });
            })
                .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            });
        }
    });
});
router.post("/login", passport.authenticate("local", {
    session: false,
}), (req, res, next) => {
    const authToken = getAuthToken({ _id: req.user._id });
    const refreshToken = getRefreshToken({ _id: req.user._id });
    User.findById(req.user._id).then((user) => {
        if (!user) {
            throw new Error("User not found"); // Throw an error if user is null
        }
        user.refreshToken.push({ refreshToken });
        user
            .save()
            .then(() => {
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token: authToken });
        })
            .catch((err) => {
            res.statusCode = 500;
            res.send(err);
        });
    }, (err) => next(err));
});
router.post("/refreshToken", (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const userId = payload._id;
            User.findOne({ _id: userId }).then((user) => {
                if (user) {
                    // Find the refresh token against the user record in database
                    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);
                    if (tokenIndex === -1) {
                        res.statusCode = 401;
                        res.send("Unauthorized");
                    }
                    else {
                        const authToken = getAuthToken({ _id: userId });
                        // If the refresh token exists, then create new one and replace it.
                        const newRefreshToken = getRefreshToken({ _id: userId });
                        user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
                        user
                            .save()
                            .then(() => {
                            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
                            res.send({ success: true, token: authToken });
                        })
                            .catch((error) => {
                            res.statusCode = 500;
                            res.send(error);
                        });
                    }
                }
                else {
                    res.statusCode = 401;
                    res.send("Unauthorized");
                }
            }, (err) => next(err));
        }
        catch (err) {
            res.statusCode = 401;
            res.send("Unauthorized");
        }
    }
    else {
        res.statusCode = 401;
        res.send("Unauthorized");
    }
});
router.get("/logout", verifyUser, (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    User.findById(req.user._id).then((user) => {
        const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);
        if (tokenIndex !== -1) {
            // remove the token from the array of stored refresh tokens and save the updated list
            // back to the database.
            user.refreshToken.splice(tokenIndex, 1);
            user
                .save()
                .then(() => {
                res.clearCookie("refreshToken", COOKIE_OPTIONS);
                res.send({ success: true });
            })
                .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            });
        }
        else {
            // If the token wasn't found in the database for some reason just nuke it from the browser cookies instead.
            res.clearCookie("refreshToken", COOKIE_OPTIONS);
            res.send({ success: true });
        }
    }, (err) => next(err));
});
router.get("/me", verifyUser, (req, res, next) => {
    res.send(req.user);
});
export default router;
//# sourceMappingURL=user.mjs.map