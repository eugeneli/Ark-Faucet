var fs = require("fs");
var arkApi = require("ark-api");
var ark = require("arkjs");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser")
var mysql = require("mysql");
var nconf = require("nconf");
var payout = require("./payout");
var Recaptcha = require("express-recaptcha");
var app = express();
app.use('/faucet', express.static("./frontend"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable("x-powered-by");

nconf.argv().file("config.json");
PAY_PER_CLICK = nconf.get("payPerClick");
COOLDOWN = nconf.get("cooldown");

LOG_FILE = nconf.get("log");

const PORT = nconf.get("port");
const DB_USERNAME = nconf.get("database:username");
const DB_PASSWORD = nconf.get("database:password");
const PASSPHRASE = nconf.argv().get("pass");
const SECOND_PASS = nconf.argv().get("secPass");

if(!PASSPHRASE)
{
    console.log("Please enter the faucet's passphrase");
    process.exit(1);
}

recaptcha = new Recaptcha(nconf.get("recaptcha:siteKey"), nconf.get("recaptcha:secretKey"));

ark.crypto.setNetworkVersion(30);
const PUB_KEY = ark.crypto.getKeys(PASSPHRASE).publicKey;
FAUCET_ADDR = ark.crypto.getAddress(PUB_KEY);

arkApi.setPreferredNode(nconf.get("node"), false);
arkApi.init("dev");

//Init MySQL
var pool = mysql.createPool({
    connectionLimit : 100,
    host: "localhost",
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: "ArkFaucet",
    debug:  false
});

getConnection = () => {
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
        arkApi.getBalance(FAUCET_ADDR, (err, succ, resp) => {
            if(!err)
            {
                var info = {
                    address: FAUCET_ADDR,
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
            console.log(`Balance: ${info.balance} DARK`);
            console.log(`Pay Per Click: ${PAY_PER_CLICK} DARK`);
            console.log(`Cooldown: ${COOLDOWN} seconds`);
            console.log("=====");
        });

        //Start payout scheduler
        const MINIMUM_THRESHOLD = nconf.get("payMinimum");
        const FREQUENCY = nconf.get("paySchedule");
        const TX_FEE = nconf.get("txFee");

        payout.startScheduler(MINIMUM_THRESHOLD, TX_FEE, FREQUENCY, PASSPHRASE, SECOND_PASS);

    });
}

startServer();
