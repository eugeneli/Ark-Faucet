"use strict";
var repo = require("../repos/faucetRepo");
var arkAPI = require("ark-api");
var moment = require("moment");
var util = require("../util");

exports.useFaucet = (req, res) => {
    console.log(req.body);
    recaptcha.verify(req, (err, data) => {
        if(!err)
        {
            var IP = req.connection.remoteAddress;
            var now = moment().toDate();
            var address = req.body.address;

            //repo.updateUnpaidBalance()
        }
        else
            util.reject(res, "403", "reCaptcha verification failed");
    })
};