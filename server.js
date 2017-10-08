var fs = require("fs");
var arkApi = require("ark-api");
var ark = require("arkjs");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser")
var mysql = require("mysql");
var nconf = require("nconf");
var Recaptcha = require("express-recaptcha");
var app = express();
app.use(express.static("./frontend"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable("x-powered-by");

nconf.argv().file("config.json");
const PORT = nconf.get("port");
const PAY_PER_CLICK = nconf.get("payPerClick");
const COOLDOWN = nconf.get("cooldown");

const DB_USERNAME = nconf.get("database:username");
const DB_PASSWORD = nconf.get("database:password");
const PASSPHRASE = nconf.argv().get("pass");

if(!PASSPHRASE)
{
    console.log("Please enter the faucet's passphrase");
    process.exit(1);
}

recaptcha = new Recaptcha(nconf.get("recaptcha:siteKey"), nconf.get("recaptcha:secretKey"));

arkApi.setPreferredNode(nconf.get("node"));
arkApi.init("main");

//Init MySQL
var pool = mysql.createPool({
    connectionLimit : 100,
    host: "localhost",
    user: DB_USERNAME,
    password: DB_PASSWORD,
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

var getFaucetAccountInfo = () => {
    return new Promise((resolve, reject) => {
        let pubKey = ark.crypto.getKeys(PASSPHRASE).publicKey;
        let faucetAddr = ark.crypto.getAddress(pubKey);

        arkApi.getBalance(faucetAddr, (err, succ, resp) => {
            if(!err)
            {
                var info = {
                    address: faucetAddr,
                    balance: resp.balance / 100000000,
                };

                resolve(info);
            }
            else
                reject(err);
        });
    });
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

    app.listen(PORT, () => {
        console.log(fs.readFileSync("art.txt", "utf8"));
        console.log(`Faucet server started on port ${PORT}`);
        getFaucetAccountInfo().then((info) => {
            console.log("=====");
            console.log(`Address: ${info.address}`);
            console.log(`Balance: ${info.balance} ARK`);
            console.log(`Pay Per Click: ${PAY_PER_CLICK} ARK`);
            console.log(`Cooldown: ${COOLDOWN} seconds`);
            console.log("=====");
        });
    });
}

startServer();