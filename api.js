const express = require('express');
const moment = require('moment');
const app = express.Router();
const _ = require('lodash');
const qrcode = require('qrcode');
const con = require("./db");
const db = con.db;

const line = require("@line/bot-sdk");
const middleware = require('@line/bot-sdk').middleware
const config = require("./config.json");
const axios = require('axios');
const client = new line.Client(config);

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

app.post("/api/getalluser", (req, res) => {
    const { usrid } = req.body;
    // console.log(usrid);
    const sql = `SELECT *, TO_CHAR(ts, 'DD-MM-YYYY') as ts7 FROM student `;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

app.post("/api/delete", (req, res) => {
    const { gid } = req.body;
    // console.log(gid);
    const sql = `DELETE FROM student WHERE gid=${gid}`;
    // console.log(sql);
    db.query(sql).then(r => {
        res.status(200).json({
            data: "success"
        })
    })
});

app.post("/api/deletecheckin", (req, res) => {
    const { gid, usrid } = req.body;
    const sql = `DELETE FROM checkin WHERE gid=${gid} AND usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: "success"
        })
    })
});

app.post("/api/insertuser", async (req, res) => {
    const { usrid, data } = req.body;
    // const sql = `INSERT INTO usertb(usrid, username, agency, linename, email, tel)VALUES('${usrid}', '${username}', '${agency}', '${linename}', '${email}', '${tel}') `;
    await db.query(`INSERT INTO student(usrid, ts)VALUES('${usrid}', now())`)

    let d;
    for (d in data) {
        if (data[d] !== '') {
            let sql = `UPDATE student SET ${d}='${data[d]}', ts=now() WHERE usrid='${usrid}'`;
            await db.query(sql)
        }
    }
    res.status(200).json({
        data: "success"
    })
});

app.post("/api/chkadmin", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT * FROM student WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

app.post("/api/updateuser", (req, res) => {
    const { usrid, data } = req.body;
    const sql = `SELECT * FROM student WHERE usrid='${usrid}'`;
    let d;
    db.query(sql).then(r => {
        if (r.rows.length > 0) {
            for (d in data) {
                if (data[d] !== '') {
                    let sql = `UPDATE student SET ${d}='${data[d]}', ts=now() WHERE usrid='${usrid}'`;
                    console.log(sql);
                    db.query(sql)
                }
            }
        } else {
            db.query(`INSERT INTO student(usrid, ts)VALUES('${usrid}', now())`).then(() => {
                for (d in data) {
                    if (data[d] !== '') {
                        let sql = `UPDATE student SET ${d}='${data[d]}', ts=now() WHERE usrid='${usrid}'`;
                        db.query(sql)
                    }
                }
            })
        }
        res.status(200).json({ data: "success" })
    })
});

app.post("/api/checkin", (req, res) => {
    const { usrid, studentid, username } = req.body;
    const sql = `INSERT INTO checkin (usrid,studentid,username,ts) VALUES ('${usrid}','${studentid}','${username}',now())`;
    db.query(sql).then(r => {
        const msg = [{
            type: 'text',
            text: `${username} [${moment().format('L')}]`
        }, {
            type: 'text',
            text: 'มาคับ!!'
        }, {
            type: 'sticker',
            packageId: '8525',
            stickerId: "16581295"
        }];

        client.pushMessage(usrid, msg);
        res.status(200).json({
            data: "success"
        })
    })
})

app.post("/api/getcheckin", (req, res) => {
    const { usrid } = req.body;
    // console.log(usrid); 
    const sql = `SELECT *, TO_CHAR(ts, 'DD-MM-YYYY HH24:MI') as ts7 FROM checkin `;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

app.post("/api/getcheckinperson", (req, res) => {
    const { usrid } = req.body;
    // console.log(usrid); 
    const sql = `SELECT TO_CHAR(ts, 'YYYY-MM-DD') as ts7 FROM checkin WHERE usrid='${usrid}' ORDER BY ts`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

app.post("/api/getcheckinall", (req, res) => {
    // console.log(usrid); 
    const sql = `SELECT a.ts, COUNT(a.ts ) as cnt
        FROM (SELECT TO_CHAR(ts, 'YYYY-MM-DD') ts FROM checkin ) a
        GROUP BY a.ts
        ORDER BY a.ts`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});


app.post('/api/loadquiz/', async (req, res) => {
    const { usrid } = req.body;
    const sql = "SELECT * FROM quizTable";
    await db.query(sql).then(r => {
        // console.log(r);
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post('/api/updatequiz', async (req, res) => {
    const { formid, sheetid, gid, title, status } = req.body;
    const sql = `UPDATE quiztable SET formid='${formid}', sheetid='${sheetid}', title='${title}', status=${status}, ts=now() WHERE gid=${gid}`;
    // console.log(sql);
    await db.query(sql).then(r => {
        res.status(200).json({
            data: "success"
        })
    })
})

app.post("/api/checkquiz", (req, res) => {
    const { quizId, sheetId, usrid } = req.body;
    // const quizId = "q1";
    console.log(quizId);
    const gooKey = 'AIzaSyDBvLZMFRD_cQB-O9tvof3EpF7_KQwMK0w';
    // const sheetId = '1k6zlZuC-PpZvwvG9KGT-xLWkc9rjXwzof6Cu0MSErV4';
    axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Form Responses 1?alt=json&key=${gooKey}`).then(async (r) => {
        await db.query(`DELETE FROM quizscore WHERE quizid='${quizId}'`);
        let sql = "";
        await r.data.values.forEach((v, i) => {
            if (i !== 0) {
                const scr = v[1].split(" ")
                sql += `INSERT INTO quizscore (quizid,usrid,soretxt,sorenum,ts)VALUES('${quizId}','${v[2]}','${v[1]}',${scr[0]},'${v[0]}');`;
            }
        })
        await db.query(sql).then(r => {
            // console.log(sql);
            res.status(200).json({
                data: "success"
            })
        })
    })
})

app.post("/api/getscore", async (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT *, TO_CHAR(ts, 'DD-MM-YYYY') as dt FROM quizscore WHERE usrid='${usrid}' ORDER BY quizid ASC`;

    await db.query(sql).then(r => {
        // console.log(sql);
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/getscore_mid", async (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT md.*, TO_CHAR(md.ts, 'DD-MM-YYYY') as dt, st.usrid 
    FROM scoremid md
    LEFT join student st
    ON md.studentid=st.studentid
    WHERE st.usrid='${usrid}'`;

    await db.query(sql).then(r => {
        console.log(sql);
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/genqr", (req, res) => {
    const { usrid } = req.body;

    let stringdata = "https://liff.line.me/1657043590-BOEgp5Yl"
    let errorCorrectionLevel = { errorCorrectionLevel: 'H' }
    qrcode.toDataURL(stringdata, errorCorrectionLevel, (err, code) => res.status(200).json({ data: code }));
    // qrcode.toString(stringdata, function (err, code) {
    //     console.log(code)
    // });
})

module.exports = app;