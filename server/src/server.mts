import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import * as chokidar from "chokidar";
import { createHttpTerminator, HttpTerminator } from "http-terminator";

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

const app = express();
var server: https.Server | Server;
var httpTerminator: HttpTerminator;
var watcher: chokidar.FSWatcher;

const logger = debug("access-code-map:server");
const port = process.env.PORT || 3001;

const privateKeyPath = "/certs/privkey.pem";
const fullChainPath = "/certs/fullchain.pem";

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const certFilesExist =
  fs.existsSync(privateKeyPath) && fs.existsSync(fullChainPath);

function readCertsSync() {
  return {
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullChainPath),
  };
}

// Function to check if the origin matches any of the whitelisted domains
function isOriginAllowed(origin: string): boolean {
  return whitelist.some((domain) => {
    if (domain.includes("*")) {
      const regex = new RegExp("^" + domain.replace(/\*/g, "[^.]+") + "$");
      return regex.test(origin);
    } else {
      return origin === domain;
    }
  });
}

export function startServer(): void {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || isOriginAllowed(origin)) {
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

  // Start up the server
  if (certFilesExist) {
    server = https.createServer(readCertsSync(), app);
    server.listen(port, () => {
      console.log("Certificate files exist, using HTTPS");
      console.log(`Listening on port ${port}`);
      logger(`Listening on port ${port}`);
    });
  } else {
    server = app.listen(port, () => {
      console.log(`Listening on port ${port}`);
      logger(`Listening on port ${port}`);
    });
  }

  // With the server up and running start watching for SSL file changes.
  startWatching();

  // Register a terminator to shut things down gracefully.
  httpTerminator = createHttpTerminator({
    server,
  });
}

export async function stopServer() {
  if (server) {
    console.log("Stopping web server...");
    await httpTerminator.terminate();
  }
  await stopWatching();
}

// From https://stackoverflow.com/a/42455876/9206264
const debouncedReloadSSL = debounce(reloadCertificates, 1000);

function reloadCertificates() {
  console.log("Certificate files changed");
  if (server instanceof https.Server) {
    console.log("Reloading SSL...");
    server.setSecureContext(readCertsSync());
    console.log("SSL reload complete!");
  }
}

function startWatching() {
  if (!certFilesExist) {
    return;
  }

  // Watch for changes to the certificate files. If they change, reload the SSL.
  // The debounced method is used to wait for changes to happen to both files
  // and only restart SSL once.
  watcher = chokidar
    .watch([fullChainPath, privateKeyPath], {
      awaitWriteFinish: true,
    })
    .on("change", debouncedReloadSSL);
  console.log(`Watching for changes to ${fullChainPath} and ${privateKeyPath}`);
}

async function stopWatching() {
  await watcher?.close();
}
