"use strict";
var repo = require("../repos/faucetRepo");
var logRepo = require("../repos/logRepo");
var arkApi = require("ark-api");
var moment = require("moment");
var util = require("../util");

var createLog = (IP, address, amount, rollTime) => {
    var log = {
        IP: IP,
        address: address,
        amount: amount,
        rollTime: rollTime
    };

    console.log(`[${rollTime}] ${address} (${IP}) +${PAY_PER_CLICK} ARK`);
    return log;
};

exports.useFaucet = (req, res) => {
    recaptcha.verify(req, (err, data) => {
        if(!err)
        {
            var IP = req.connection.remoteAddress;
            var now = moment();
            var address = req.body.address;

            arkApi.getBalance(FAUCET_ADDR, (err, succ, resp) => {
                if(!err)
                {
                    var faucetBalance = resp.balance / 100000000;
                    var sumUnpaidBalancesP = repo.sumUnpaidBalance();
                    var lastRollTimeP = repo.getRollTimeByIp(IP);

                    Promise.all([sumUnpaidBalancesP, lastRollTimeP]).then((resp) => {
                        var totalUnpaid = resp[0].sum;
                        var rollTimeRow = resp[1];

                        //Check if cooldown is up
                        if(rollTimeRow.length > 0)
                        {
                            var lastRollTime = moment(rollTimeRow[0].lastRoll);
                            var diff = now.diff(lastRollTime, "seconds");
                            console.log(diff)
                            if(diff < COOLDOWN)
                                return util.reject(res, "403", "Try again later")
                        }

                        //Make sure we don't become insolvent
                        //faucetBalance = 10000;
                        if(totalUnpaid + PAY_PER_CLICK >= faucetBalance)
                            return util.reject(res, "403", "Faucet is empty, please check back later");

                        //Checks passed, credit them now
                        var updatePendingP = repo.updateUnpaidBalance(address, PAY_PER_CLICK);
                        var updateRollTimeP = repo.updateRollTime(IP, now.toDate());

                        logRepo.addLog(createLog(IP, address, PAY_PER_CLICK, now.toDate()));
                        Promise.all([updatePendingP, updateRollTimeP]).then(() => {
                            return res.send({
                                rollTime: now.toDate()
                            });
                        });
                    });
                }
                else
                    reject(err);
            });
        }
        else
            util.reject(res, "403", "reCaptcha verification failed");
    })
};