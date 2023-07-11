import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import connectToDatabase from "./util/connectdb.mjs";
import passport from "passport";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import * as chokidar from "chokidar";

// Workaround for lodash being a CommonJS module
import pkg from "lodash";
const { debounce } = pkg;

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
var watcher: chokidar.FSWatcher;
var server: https.Server | Server;

const privateKeyPath = "/certs/privkey.pem";
const fullChainPath = "/certs/fullchain.pem";

function readCertsSync() {
  return {
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullChainPath),
  };
}

const certFilesExist =
  fs.existsSync(privateKeyPath) && fs.existsSync(fullChainPath);

function reloadSSL() {
  console.log("Certificate changed!");
  if (server instanceof https.Server) {
    console.log("Reloading SSL...");
    server.setSecureContext(readCertsSync());
    console.log("SSL reload complete!");
  }
}

// From https://stackoverflow.com/a/42455876/9206264
const debouncedReloadSSL = debounce(reloadSSL, 1000);

async function startServer() {
  console.log(`Private key path: ${privateKeyPath}`);
  console.log(`Full chain path: ${fullChainPath}`);

  await connectToDatabase();

  if (certFilesExist) {
    server = https.createServer(readCertsSync(), app);
    server.listen(port, () => {
      console.log(`Server running on port ${port} (SSL)`);
    });

    // Watch for changes to the certificate files. If they change, reload the SSL.
    // The debounced method is used to wait for changes to happen to both files
    // and only restart SSL once.
    watcher = chokidar
      .watch([fullChainPath, privateKeyPath], {
        awaitWriteFinish: true,
      })
      .on("change", debouncedReloadSSL);
    console.log(
      `Watching for changes to ${fullChainPath} and ${privateKeyPath}`
    );
  } else {
    server = app.listen(port, () => {
      console.log(`Listening on port ${port}`);
      logger(`Listening on port ${port}`);
    });
  }
}

async function stopServer() {
  console.log("Shutting down...");
  await watcher?.close();
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
