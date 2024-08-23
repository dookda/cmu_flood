const Pool = require('pg').Pool
const { Client } = require('pg')

const db = new Pool({
    host: 'postgis',
    user: 'postgres',
    database: 'cmu_flood',
    password: '1234',
    port: 5432,
});

exports.db = db;