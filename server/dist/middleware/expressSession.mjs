import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
const MongoDBStoreSession = MongoDBStore(session);
import { dbUrl, dbName } from "../db.mjs";
const expressSession = () => {
    return session({
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
        secret: "m&k2QvESUs@X@kN1",
        resave: false,
        saveUninitialized: false,
        store: new MongoDBStoreSession({
            collection: "sessions",
            uri: dbUrl,
            databaseName: dbName,
        }),
    });
};
export default expressSession;
//# sourceMappingURL=expressSession.mjs.map