"use strict";
var getConnection = require("../../server").getConnection;
var faucetRepo = require("../repos/faucetRepo");

exports.getUnpaidBalanceByAddress = (address) => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT * FROM Unpaid_Balances WHERE address = ?", [address], function(err, rows) {
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
            con.query("SELECT * FROM Unpaid_Balances", function(err, rows) {
                con.release();
                if(!err)
                    resolve(rows);
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
            con.query("INSERT INTO Unpaid_Balances set ? ON DUPLICATE KEY UPDATE pending = pending + ?", [unpaidBal, payPerClick], (err, rows) => {
                con.release();
                if(!err)
                    resolve();
                else
                {
                    console.log(err);
                    reject(err);
                }
            });


/*
            con.query("SELECT * FROM Unpaid_Balances WHERE address = ?", address, (err, rows) => {
                if(!err && rows.length > 0) //If there is already a pending balance, update it
                {
                    var currentPending = new BigNumber(parseFloat(rows[0].pending));
                    var totalUnpaid = currentUnpaid.plus(payPerClick);

                    //Store new balance in db
                    con.query("UPDATE Unpaid_Balances SET pending = ? WHERE address = ?", [totalUnpaid.toString(), address], (err, rows) => {
                        con.release();
                        if(!err)
                            resolve();
                        else
                        {
                            console.log("Couldn't update unpaid balances row. " + address + " " + totalUnpaid.toString());
                            reject(err);
                        }
                    });
                }
                else if(!err) //Create new pending balance
                {
                    var unpaidBal = {
                        address: address,
                        pending: payPerClick.toString()
                    };
                    con.query("INSERT INTO Unpaid_Balances set ?", unpaidBal, (err, rows) => {
                        con.release();
                        if(!err)
                            resolve();
                        else
                        {
                            console.log("Couldn't insert new unpaid balances row. " + unpaidBal.address + " " + unpaidBal.pending);
                            reject(err);
                        }
                    });
                }
                else
                {
                    con.release();
                    console.log(err);
                    reject(err);
                }
            });
*/
        });
    });
};

exports.getRollTimeByIp = (ip) => {
    return new Promise((resolve, reject) => {
        getConnection().then((con) => {
            con.query("SELECT * FROM Roll_Times WHERE IP = ?", [ip], function(err, rows) {
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
            con.query("SELECT * FROM Roll_Times", function(err, rows) {
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
            con.query("INSERT INTO Roll_Times set ? ON DUPLICATE KEY UPDATE lastRoll = ?", [unpaidBal, rollTime], (err, rows) => {
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