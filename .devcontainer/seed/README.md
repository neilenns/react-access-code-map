# mongodb local database initialization

> [!WARNING]
> The database is initialized every time the devcontainer gets recreated. This means all content gets wiped. If meaningful data needs to be persisted, add it using .json files in this folder.

The scripts in this folder initialize the mongodb database in the db container for use with local development.

`init.sh` does the following:

- Runs `init.js` script, which deletes the `clearancelab` database, creates a `clearancelab:clearancelab` user.
- Runs `mongoimport` to import JSON files with sample data.
  To add additional sample data, add a json file to the folder, then add a `mongodbimport` line to the `init.sh` script.
