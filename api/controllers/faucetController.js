"use strict";
const repo = require("../repos/faucetRepo");
const logRepo = require("../repos/logRepo");
const arkApi = require("ark-api");
const moment = require("moment");
const util = require("../util");

const createLog = (IP, address, amount, rollTime) => {
    const log = {
        IP: IP,
        address: address,
        amount: amount,
        rollTime: rollTime
    };

    console.log(`[${rollTime}] ${address} (${IP}) +${PAY_PER_CLICK} ARK`);
    return log;
};

const timeDiff = (now, lastRollTime, cooldown) => {
    const diff = now.diff(lastRollTime, "seconds");
    return { canRoll: diff > cooldown, diff: diff };
};

exports.useFaucet = (req, res) => {
    const address = req.body.address;
    if(!util.isAddress(address))
        return util.reject(res, "400", "Invalid Ark address");

    recaptcha.verify(req, async (err, data) => {
        if(err)
            return util.reject(res, "403", "reCaptcha verification failed");

        const IP = req.connection.remoteAddress;
        const now = moment();

        const [ faucetAcct, unpaidBal, ipRollRow, addrRollRow ] = await Promise.all([util.getFaucetAccountInfo(),
                                                                            repo.sumUnpaidBalance(),
                                                                            repo.getRollTimeByIp(IP),
                                                                            repo.getRollTimeByAddress(address)]);

        let timeDifference = { canRoll:true, diff: 0 };

        //Check if IP cooldown is up
        if(ipRollRow.length > 0)
        {
            timeDifference = timeDiff(now, moment(ipRollRow[0].lastRoll), COOLDOWN);
            if(!timeDifference.canRoll)
                return util.reject(res, "403", "Try again later");
        }

        //Check if address was already rolled for recently
        if(addrRollRow.length > 0)
        {
            const timeDifference = timeDiff(now, moment(addrRollRow[0].lastRoll), COOLDOWN);
            if(!timeDifference.canRoll)
                return util.reject(res, "403", "Try again later");
        }

        //Make sure we don't become insolvent
        if(unpaidBal.sum + PAY_PER_CLICK >= faucetAcct.balance)
            return util.reject(res, "403", "Faucet is empty, please check back later");

        //Checks passed, credit them now
        const updatePendingP = repo.updateUnpaidBalance(address, PAY_PER_CLICK);
        const updateRollTimeP = repo.updateRollTime(IP, now.toDate(), address);

        logRepo.addLog(createLog(IP, address, PAY_PER_CLICK, now.toDate()));
        await Promise.all([updatePendingP, updateRollTimeP]);

        return res.send({
            timeDiff: timeDifference.diff
        });
    });
};

exports.getStatus = async (req, res) => {
    const IP = req.connection.remoteAddress;
    const resp = await repo.getRollTimeByIp(IP);

    if(resp.length == 0)
        return res.send({canRoll: true});

    const lastRollTime = moment(resp[0].lastRoll);
    const timeDifference = timeDiff(moment(), lastRollTime, COOLDOWN);
    if(timeDifference.canRoll)
        return res.send({canRoll: true});
    else
        return res.send({canRoll: false, timeDiff: timeDifference.diff});
};

exports.getInfo = (req, res) => {
    const faucetInfo = {
        address: FAUCET_ADDR,
        payPerClick: PAY_PER_CLICK,
        cooldown: COOLDOWN
    };

    res.send(faucetInfo);
};

exports.getRecentLogs = async (req, res) => {
    return res.send(await logRepo.getRecentLogs(10));
};

exports.getCaptcha = (req, res) => {
    res.send({ captcha: recaptcha.render() });
};
