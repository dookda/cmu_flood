const Pool = require('pg').Pool
const { Client } = require('pg')

const db = new Pool({
    user: 'postgres',
    host: '172.16.0.2',
    database: 'cmu_flood',
    password: 'Eec-MIS2564db',
    port: 5432,
});

exports.db = db;