"use strict";
var BigNumber = require("bignumber.js");

var alphanumRegex = /^[a-z0-9]+$/i;

exports.reject = (res, status, msg) => {
    console.log(`Rejected: ${status} - ${msg}`);
    res.status(status);
    res.send(msg);
}

exports.isAddress = (addr) => {
    return alphanumRegex.test(addr) && addr.length == 34 && addr.charAt(0) == 'A';
};

