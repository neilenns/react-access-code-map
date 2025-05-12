db = connect("mongodb://db:27017/clearancelab");

// Nuke the existing database
db.dropDatabase();
