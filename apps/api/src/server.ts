import bodyParser from "body-parser";
import * as chokidar from "chokidar";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import { createHttpTerminator, HttpTerminator } from "http-terminator";
import passport from "passport";
import { ENV } from "./env.js";
import mainLogger from "./logger.js";
import morgan from "./middleware/morgan.js";
import { isOriginAllowed } from "./util/cors.js";

const logger = mainLogger.child({ service: "server" });

// Workaround for lodash being a CommonJS module
import pkg from "lodash";
const { debounce } = pkg;

// Routes
import fs from "fs";
import https from "https";
import defaultRouter from "./routes/default.js";
import locationsRouter from "./routes/locations.js";
import userRouter from "./routes/user.js";

// Authentication
import { Server } from "http";
import "./authenticate.js";
import "./strategies/jwtStrategy.js";
import "./strategies/LocalStrategy.js";

const app = express();
var server: https.Server | Server;
var httpTerminator: HttpTerminator;
var watcher: chokidar.FSWatcher;

const privateKeyPath = ENV.SSL_PRIVATE_KEY_PATH;
const fullChainPath = ENV.SSL_FULL_CHAIN_PATH;

const certFilesExist =
  fs.existsSync(privateKeyPath) && fs.existsSync(fullChainPath);

function readCertsSync() {
  return {
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullChainPath),
  };
}

export function startServer(): void {
  app.set("trust proxy", ENV.TRUST_PROXY);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser(ENV.COOKIE_SECRET));
  app.use(morgan);

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
    server.listen(ENV.PORT, () => {
      logger.info("Certificate files exist, using HTTPS");
      logger.info(`Listening on port ${ENV.PORT}`);
    });
  } else {
    server = app.listen(ENV.PORT, () => {
      logger.info(`Listening on port ${ENV.PORT}`);
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
    logger.debug("Stopping web server...");
    await httpTerminator.terminate();
  }
  await stopWatching();
}

// From https://stackoverflow.com/a/42455876/9206264
const debouncedReloadSSL = debounce(reloadCertificates, 1000);

function reloadCertificates() {
  logger.debug("Certificate files changed");
  if (server instanceof https.Server) {
    logger.debug("Reloading SSL...");
    server.setSecureContext(readCertsSync());
    logger.debug("SSL reload complete!");
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
  logger.debug(
    `Watching for changes to ${fullChainPath} and ${privateKeyPath}`
  );
}

async function stopWatching() {
  await watcher?.close();
}
