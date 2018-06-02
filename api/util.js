"use strict";
const BigNumber = require("bignumber.js");
const fs = require("fs");
const arkApi = require("ark-api");

const addrRegex = /^A[a-z0-9A-Z]{33}$/;

exports.getFaucetAccountInfo = () => {
    return new Promise((resolve, reject) => {
        arkApi.getBalance(FAUCET_ADDR, (err, succ, resp) => {
            if(!err)
            {
                const info = {
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

exports.reject = (res, status, msg) => {
    console.log(`Rejected: ${status} - ${msg}`);
    const resp = {
        success: false,
        message: msg
    }
    res.status(status);
    res.send(resp);
}

exports.isAddress = (addr) => {
    return addrRegex.test(addr);
};

exports.log = (msg, doAsync) => {
    console.log(msg);
    if(doAsync)
        fs.appendFile(LOG_FILE, msg);
    else
        fs.appendFileSync(LOG_FILE, msg);
};