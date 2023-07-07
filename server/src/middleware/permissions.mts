// React router middleware for checking permissions on routes
// based on the request type (GET, PUT, POST, DELETE, etc.)
// and the user's permissions in the mongo database.

// Import the User model
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.mjs";

export default function verifyPermissions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  User.findById(req.user!._id).then((user) => {
    if (!user) {
      res.statusCode = 401;
      res.send("Unauthorized");
      next("router");
      return;
    }

    // Check if the user has permission to create
    if (req.method === "POST" && !user.canCreate) {
      res.statusCode = 403;
      res.send("Forbidden");
      next("router");
      return;
    }

    // Check if the user has permission to edit
    if (req.method === "PUT" && !user.canEdit) {
      res.statusCode = 403;
      res.send("Forbidden");
      next("router");
      return;
    }

    // Check if the user has permission to delete
    if (req.method === "DELETE" && !user.canDelete) {
      res.statusCode = 403;
      res.send("Forbidden");
      next("router");
      return;
    }

    // If the user has permission, continue to the next middleware
    next();
  });
}
