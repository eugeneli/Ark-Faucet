var arkApi = require("ark-api");
var ark = require("arkjs");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser")
var mysql = require("mysql");
var nconf = require("nconf");
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.disable("x-powered-by");

nconf.argv().file("config.json");
const DB_USERNAME = nconf.get("database:username");
const DB_PASSWORD = nconf.get("database:password");

const PAY_PER_CLICK = nconf.get("payPerClick");
const RECAPTCHA = nconf.get("");

const PASSPHRASE = nconf.argv().get("pass");

if(!PASSPHRASE)
{
    console.log("Please enter the faucet's passphrase");
    process.exit(1);
}

PUB_KEY = ark.crypto.getKeys(PASSPHRASE).publicKey;
FAUCET_ADDRESS = ark.crypto.getAddress(PUB_KEY);

arkApi.init("main");

//Init MySQL
var pool = mysql.createPool({
    connectionLimit : 100,
    host: "localhost",
    user: process.env.FAUCET_DB_USERNAME,
    password: process.env.FAUCET_DB_PASSWORD,
    database: "ArkFaucet",
    debug:  false
});

exports.getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err)
                reject(err);
            
            resolve(connection);
        });
    }).catch((err) => console.log(err));
};

var startServer = () => {
    var routes = require("./api/routes/routes");
    routes(app);

    app.all("/*", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Auth-Token");
        if(req.method == "OPTIONS")
            res.status(200).end();
        else
            next();
    });

    app.listen(8080, () => {
        console.log("faucet backend server started on port 8080");
    });
}

startServer();