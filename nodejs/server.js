const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

// app.use(cors());
// app.options('*', cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://envirservice.co.th');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// const whk = require('./service/webhook');
// app.use(whk);

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// const api = require('./service/api');
// app.use(api);

app.use('/flood', express.static('www'))

const port = 3600;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

const api = require('./service/api');
app.use(api);