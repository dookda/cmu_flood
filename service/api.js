const express = require('express');
const moment = require('moment');
const app = express.Router();
const _ = require('lodash');
const qrcode = require('qrcode');
const con = require("./db");
const db = con.db;

const line = require("@line/bot-sdk");
const middleware = require('@line/bot-sdk').middleware
const axios = require('axios');
// const client = new line.Client(config);

app.post("/api/pushmsg", (req, res) => {
    const { usrid } = req.body;
    const msg = [{
        type: 'text',
        text: 'เช็คชื่อแล้ว'
    }, {
        type: 'sticker',
        packageId: '6136',
        stickerId: "10551378"
    }];

    const userId = 'U4ed9e8cc38198119ed772a6c9e13835e'
    client.pushMessage(userId, msg)
});

app.post("/api/getuser", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT * FROM student WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

module.exports = app;