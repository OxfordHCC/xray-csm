const DB = require("../db/db")
const db = new DB('csm');


const express = require("express");
const config = require("../config/config.json");

const app = express();

app.get('/', (req, res) => {
    res.send("");
});

app.get('/apps/:appID', async (req, res) => {
    let appID = req.params.appID;
    console.log(`Request Recieved for: ${appID}`);
    let app = await db.selectAppInfos(appID) 
    res.send(app);
});

app.listen(config.api.port, () => console.log(`listening on port ${config.api.port}`));
