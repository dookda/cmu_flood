const express = require('express');
const moment = require('moment');
const app = express.Router();
const _ = require('lodash');
const con = require("./db");
const db = con.db;



app.post("/flood/api/insertdata", async (req, res) => {
    console.log(req.body);
    const { data } = req.body;
    let usrid = Date.now()
    await db.query(`INSERT INTO cmu_flood(usrid, ts)VALUES('${usrid}', now())`)
    let d;
    for (d in data) {
        // console.log(`${d}='${data[d]}'`);
        if (data[d] !== '' && d !== 'geom') {
            let sql = `UPDATE cmu_flood SET ${d}='${data[d]}' WHERE usrid='${usrid}';`;
            // console.log(sql);
            await db.query(sql)
        }

        if (data.geom !== "") {

            let sql = `UPDATE cmu_flood
                        SET geom=ST_GeomfromText('POINT(${data.geom[0]} ${data.geom[1]} )',4326)
                        WHERE usrid='${usrid}';`

            await db.query(sql)
        }
    }
    res.status(200).json({
        data: "success"
    })
});



// app.post("/api/getdata", (req, res) => {
//     const { usrid } = req.body;
//     const sql = `SELECT * FROM cmu_flood`;
//     db.query(sql).then(r => {
//         res.status(200).json({
//             data: r.rows
//         })
//     })
// });


app.get("/flood/api/getdata", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT *, 
    to_char(ts,'DD-MM-YYYY HH24:MM' ) as tstxt, 
    st_asgeojson(geom) as geojson,
    st_x(geom) as lng,
    st_y(geom) as lat,
    case when ts > (now() - interval '48 hours') then '>48hr' else '<48hr' end as stat
    FROM cmu_flood`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

module.exports = app;