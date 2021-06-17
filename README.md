# Rent-a-barber-x

# 0. install all dependencies
npm install

# 1. compile assets (webpack - js)
npm run webpack-watch

# 2. compile assets (sass - css)
npm run scss:watch

# 3. run the app (express + mongodb backend)
npm run node-dev

# 4. Go to http://localhost:3002/login to get started

# 5. MongoDB
    -Import data: 
        -All collections from latest export:
            node ./database/scripts/import-all-latest-dir.js
        -All collections from a selected timestamp export:
            node ./database/scripts/import-all-selected-dir.js
        -Some collections from latest export:
            node ./database/scripts/import-filter-latest-dir.js
        -Some collections from selected timestamp export:
            node ./database/scripts/import-filter-selected-dir.js
    -Export data: 
        -From All collections:
            node ./database/scripts/export-all-collections.js
        -Some collections:
            node ./database/scripts/export-filter-collections.js
    -Seed (generate) data:
        node ./database/scripts/seed-[barbershops|users].js
    -Drop database:
        node ./database/scripts/drop-database.js
    -Delete collections:
        -Delete all collections:
            node ./database/scripts/delete-all-collections.js
        -Delete some collections:
            node ./database/scripts/export-filter-collections.js