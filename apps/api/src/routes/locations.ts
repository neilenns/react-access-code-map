import express from "express";
import { ObjectId } from "mongodb";
import { verifyUser } from "../authenticate.js";
import mainLogger from "../logger.js";
import verifyPermissions from "../middleware/permissions.js";
import { ILocation, Location } from "../models/location.js";

const logger = mainLogger.child({ service: "locations" });

const router = express.Router();

router.get(
  "/locations",
  verifyUser,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const locations = await Location.find();

      res.json(locations);
    } catch (err) {
      logger.error("Error fetching locations:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/locations/:id",
  verifyUser,
  verifyPermissions,
  async (req: express.Request, res: express.Response) => {
    try {
      const locationId = req.params.id;
      const updatedData = {
        title: req.body.title,
        note: req.body.note,
        hasToilet: req.body.hasToilet,
        lastModified: new Date(),
        modifiedBy: req.user?._id,
      };

      const result = await Location.findByIdAndUpdate(
        new ObjectId(locationId),
        updatedData,
        { new: true } // This option returns the updated location
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update marker" });
    }
  }
);

router.post(
  "/locations",
  verifyUser,
  verifyPermissions,
  async (req: express.Request, res: express.Response) => {
    try {
      const { title, latitude, longitude, note } = req.body;

      var date = new Date();

      const newLocation = await Location.create({
        title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        note,
        hasToilet: req.body.hasToilet,
        createdBy: req.user?._id,
        created: date,
        modifiedBy: req.user?._id,
        lastModified: date,
      } as ILocation);

      res.status(201).json(newLocation);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating location: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/locations/:id",
  verifyUser,
  verifyPermissions,
  async (req: express.Request, res: express.Response) => {
    try {
      const locationId = req.params.id;

      const result = await Location.findByIdAndDelete(new ObjectId(locationId));

      if (result) {
        logger.debug("Location deleted successfully");
        res.sendStatus(204); // Send a success status code (No Content)
      } else {
        logger.debug("Location not found");
        res.sendStatus(404); // Send a not found status code
      }
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting location: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
