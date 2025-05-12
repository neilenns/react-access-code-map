#!/bin/bash
set -euo pipefail

echo "📦 Seeding database..."

# Initialize the database

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export DB_URI="mongodb://db:27017/access-code-map"

mongosh "${DB_URI}" "${SCRIPT_DIR}/init.js" > /dev/null

mongoimport --quiet --uri="${DB_URI}" --collection=locations --file="${SCRIPT_DIR}/access-code-map.locations.json" --jsonArray
