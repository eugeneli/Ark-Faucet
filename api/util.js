"use strict";
var BigNumber = require("bignumber.js");
var fs = require("fs");

var alphanumRegex = /^[a-z0-9]+$/i;

exports.reject = (res, status, msg) => {
    console.log(`Rejected: ${status} - ${msg}`);
    var resp = {
        success: false,
        message: msg
    }
    res.status(status);
    res.send(resp);
}

exports.isAddress = (addr) => {
    return alphanumRegex.test(addr) && addr.length == 34 && addr.charAt(0) == 'A';
};

exports.log = (msg, async) => {
    console.log(msg);
    if(async)
        fs.appendFile(LOG_FILE, msg);
    else
        fs.appendFileSync(LOG_FILE, msg);
};