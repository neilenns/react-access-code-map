import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./util/connectdb.mjs";
import passport from "passport";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRouter from "./routes/user.mjs";
import defaultRouter from "./routes/default.mjs";
import locationsRouter from "./routes/locations.mjs";
import fs from "fs";
import https from "https";
import debug from "debug";

// Authentication
import "./strategies/jwtStrategy.mjs";
import "./strategies/LocalStrategy.mjs";
import "./authenticate.mjs";
import { Server } from "http";

const logger = debug("access-code-map:server");
const port = process.env.PORT || 3001;
var server: https.Server | Server;

async function startServer() {
  await connectToDatabase();

  const certFilesExist =
    fs.existsSync("/certs/privkey.pem") &&
    fs.existsSync("/certs/fullchain.pem");

  if (certFilesExist) {
    const options = {
      key: fs.readFileSync("/certs/privkey.pem"),
      cert: fs.readFileSync("/certs/fullchain.pem"),
    };

    server = https.createServer(options, app);
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } else {
    server = app.listen(port, () => {
      console.log(`Listening on port ${port}`);
      logger(`Listening on port ${port}`);
    });
  }
}

function stopServer() {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Server shutdown complete!");
    process.exit(0);
  });
}

const app = express();

// Configure the server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
} as CorsOptions;

app.use(cors(corsOptions));

// Configure authentication
app.use(passport.initialize());

// Set up the routes
app.use("/users", userRouter);
app.use(locationsRouter);
app.use(defaultRouter);

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);

// Run it!
startServer();
