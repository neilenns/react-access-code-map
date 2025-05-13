import "dotenv/config";

import { ENV } from "./env.js";
import mainLogger from "./logger.js";
import * as WebServer from "./server.js";
import * as db from "./util/database.js";

const logger = mainLogger.child({ service: "main" });

// If startup fails restart is reattempted 5 times every 30 seconds.
const restartAttemptWaitTime = 30 * 1000;
const maxRestartAttempts = 5;
var restartAttemptCount = 0;
var restartTimer: NodeJS.Timeout;

async function startup() {
  try {
    logger.info(`Server version ${ENV.VERSION} starting`);
    await db.connectToDatabase();
    WebServer.startServer();

    // At this point startup succeeded so reset the restart count. This is in case
    // later hot reloads cause something to break, it should still support multiple
    // restarts.
    restartAttemptCount = 0;
  } catch (err) {
    logger.error(`Error starting server: ${err}`);

    // Shutdown things that may have spun up successfully.
    await shutdown();

    restartAttemptCount++;

    // Try starting again in a little bit.
    if (restartAttemptCount < maxRestartAttempts) {
      logger.info(
        `Startup reattempt ${restartAttemptCount} of ${maxRestartAttempts} in ${
          restartAttemptWaitTime / 1000
        } seconds.`
      );
      restartTimer = setTimeout(startup, restartAttemptWaitTime);
    } else {
      logger.error(`Startup failed ${maxRestartAttempts} times. Giving up.`);
      return;
    }
  }
}

async function shutdown() {
  logger.debug("Shutting down...");
  clearTimeout(restartTimer);
  await WebServer.stopServer();
  await db.disconnectFromDatabase();
  logger.debug("Shutdown complete.");
}

async function handleDeath() {
  await shutdown();
  process.exit();
}

function registerForDeath(): void {
  process.on("SIGINT", handleDeath);
  process.on("SIGTERM", handleDeath);
  process.on("SIGQUIT", handleDeath);
  process.on("SIGBREAK", handleDeath);
}

registerForDeath();

startup();
