"use strict";
var getConnection = require("../../server").getConnection;

exports.getUnpaidBalanceByAddress = (address) => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT * FROM ArkFaucet.Unpaid_Balances WHERE address = ?", [address], function(err, rows) {
                con.release();
                if(!err)
                    resolve(rows);
                reject(err);
            });
        });
    });
};

exports.getAllUnpaidBalances = () => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT * FROM ArkFaucet.Unpaid_Balances", function(err, rows) {
                con.release();
                if(!err)
                    resolve(rows);
                reject(err);
            });
        });
    });
};

exports.sumUnpaidBalance = () => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT SUM(pending) FROM ArkFaucet.Unpaid_Balances", function(err, rows) {
                con.release();
                if(!err)
                {
                    var sum = parseFloat(rows["SUM(pending)"]);
                    if(isNaN(sum))
                        resolve({sum: 0});
                    else
                        resolve({sum: sum});
                }
                reject(err);
            });
        });
    });
};

exports.updateUnpaidBalance = (address, payPerClick) => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            var unpaidBal = {
                address: address,
                pending: payPerClick.toString()
            };
            con.query("INSERT INTO ArkFaucet.Unpaid_Balances set ? ON DUPLICATE KEY UPDATE pending = pending + ?", [unpaidBal, payPerClick], (err, rows) => {
                con.release();
                if(!err)
                    resolve();
                else
                {
                    console.log(err);
                    reject(err);
                }
            });
        });
    });
};

exports.getRollTimeByIp = (ip) => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT * FROM ArkFaucet.Roll_Times WHERE IP = ?", [ip], function(err, rows) {
                con.release();
                if(!err)
                    resolve(rows);
                reject(err);
            });
        });
    });
};

exports.getAllRollTimes = () => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT * FROM ArkFaucet.Roll_Times", function(err, rows) {
                con.release();
                if(!err)
                    resolve(rows);
                reject(err);
            });
        });
    });
};

exports.updateRollTime = (IP, rollTime) => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            var unpaidBal = {
                IP: IP,
                lastRoll: rollTime
            };
            con.query("INSERT INTO ArkFaucet.Roll_Times set ? ON DUPLICATE KEY UPDATE lastRoll = ?", [unpaidBal, rollTime], (err, rows) => {
                con.release();
                if(!err)
                    resolve();
                else
                {
                    console.log(err);
                    reject(err);
                }
            });
        });
    });
};