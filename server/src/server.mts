import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./db.mjs";

// Routes
import locationsRouter from "./routes/locations.mjs";

const port = 3001;

async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

const app = express();

// Configure the server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up the routes
app.use(locationsRouter);

// Run it!
startServer();
