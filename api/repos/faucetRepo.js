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
