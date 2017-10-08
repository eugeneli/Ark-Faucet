"use strict";
var repo = require("../repos/faucetRepo");
var arkAPI = require("ark-api");
var util = require("../util");

exports.useFaucet = (req, res) => {
    recaptcha.verify(req, (err, data) => {
        if(!err)
        {

        }
        else
            util.reject(res, "403", "reCaptcha verification failed");
    })
};