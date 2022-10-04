const Pool = require('pg').Pool
const { Client } = require('pg')

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cmu_flood',
    password: 'Eec-MIS2564db',
    port: 5432,
});

exports.db = db;