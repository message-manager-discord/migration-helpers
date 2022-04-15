# migration-helpers

This is for migrating the database from message-manager-discord/bot to message-manager-discord/backend

To use this
Set the connection string in ./source/index.js and run `npm i` and then `node index.js` in `./source/`

Then copy `./source/data.json` to `./final/data.json`

Fill in the connection string for the final database in `./final/.env` (the database must already be migrated with tables, to do this just run the backend once) it also must be empty. Then run `npm i` `npx prisma generate` `node index.js`

Any issues join the support server :) https://discord.gg/xv7VyN6YHR
