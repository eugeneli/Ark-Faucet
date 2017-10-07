var arkApi = require("ark-api");
var ark = require("arkjs");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser")
var mysql = require("mysql");
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.disable("x-powered-by");

var passphrase;
var args = process.argv.slice(2);
if(args.length == 1)
    passphrase = args[0];
else
{
    console.log("Enter passphrase");
    process.exit(1);
}

PUB_KEY = ark.crypto.getKeys(passphrase).publicKey;
FAUCET_ADDRESS = ark.crypto.getAddress(PUB_KEY);

arkApi.init("main");
arkApi.setPreferredNode("108.61.23.81");

//Init MySQL
var pool = mysql.createPool({
    connectionLimit : 100,
    host: "localhost",
    user: process.env.BIZFAUCET_DB_USERNAME,
    password: process.env.BIZFAUCET_DB_PASSWORD,
    database: "BizFaucet",
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