const DB = require("../db/db")
const db = new DB('csm');


const express = require("express");
const config = require("../config/config.json");

const app = express();

app.get('/', (req, res) => {
    res.send("");
});

app.get('/apps/:appID', async (req, res) => {
    res.send({"data":"Some App Data will come here."});
});

app.listen(config.api.port, () => console.log(`listening on port ${config.api.port}`));
