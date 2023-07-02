import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./db.mjs";
import passport from "passport";
import session from "express-session";
import MongoDBStoreFactory from "connect-mongodb-session";
import expressSession from "./middleware/expressSession.mjs";
import cors from "cors";
// Routes
import authRouter from "./routes/auth.mjs";
import locationsRouter from "./routes/locations.mjs";
const port = 3001;
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}
const app = express();
const MongoDBStore = MongoDBStoreFactory(session);
// Configure the server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Configure authentication
app.use(expressSession());
app.use(passport.session());
// Set up the routes
app.use(authRouter);
app.use(locationsRouter);
// Run it!
startServer();
//# sourceMappingURL=server.mjs.map