import mongoose from "mongoose";
export default async function connectToDatabase() {
    const url = process.env.MONGO_DB_CONNECTION_STRING;
    if (!url) {
        console.log(`No database connection string provided for MONGO_DB_CONNECTION_STRING`);
        return;
    }
    mongoose.set("bufferCommands", false);
    const connect = mongoose.connect(url, {
        dbName: process.env.MONGO_DB_NAME,
    });
    connect
        .then((db) => {
        console.log("Connected to database");
    })
        .catch((err) => {
        console.log(err);
    });
}
//# sourceMappingURL=connectdb.mjs.map