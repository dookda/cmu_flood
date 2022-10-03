const Pool = require('pg').Pool
const { Client } = require('pg')

const db = new Pool({
    user: 'postgres',
    host: '119.59.125.134',
    database: 'cmu_flood',
    password: 'Pgis@rti2dss@2020',
    port: 5432,
});

exports.db = db;