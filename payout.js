//var repo = require("./api/repos/faucetRepo");
var arkApi = require("ark-api");
var moment = require("moment");
var BigNumber = require("bignumber.js");
var scheduler = require("node-schedule");

var doPayout = (threshold, fee, passphrase, secondPassphrase) => {
    console.log("==Payout Begin==");
    console.log("DateTime: " + moment().toISOString());
    console.log("Getting pending balances...");

};

exports.startScheduler = (threshold, fee, cronJob, passphrase, secondPassphrase) => {
    console.log(`Automatic payouts scheduled: ${cronJob}`);
    var paySchedule = scheduler.scheduleJob(cronJob, () => {
        doPayout(threshold, passphrase, secondPassphrase);
    });
};
