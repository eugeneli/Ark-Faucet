const repo = require("./api/repos/faucetRepo");
const arkApi = require("ark-api");
const moment = require("moment");
const BigNumber = require("bignumber.js");
const scheduler = require("node-schedule");
const util = require("./api/util");

const doPayout = async (threshold, fee, passphrase, secondPassphrase) => {
    util.log("==Payout Begin==");
    util.log("DateTime: " + moment().toISOString());
    util.log("Getting pending balances...");

    const balances = await repo.getOverthresholdBalances(threshold);
    if(balances.length == 0)
        return;

    const options = { secondPassphrase: secondPassphrase };

    const addrs = balances.map((bal) => bal.address);
    const txs = balances.map((bal) => {
        const txFee = new BigNumber(fee).times(100000000);
        let payout = new BigNumber(bal.pending).times(100000000); //convert to arktoshis
        payout = payout.minus(txFee);

        const tx = arkApi.createTransaction(passphrase, bal.address, payout.toNumber(), options);
        const logMsg = `${bal.address} ${parseFloat(bal.pending)} ${tx.id}`;
        util.log(logMsg);
        
        return tx;
    });

    repo.deleteUnpaidBalances(addrs);

    const txBundles = [];
    while(txs.length)
        txBundles.push(txs.splice(0, 10));

    util.log("Paying now...");
    let i = 0;
    function queuePayments()
    {
        const bundle = txBundles[i];
        util.log(`Sending tx bundle ${i+1}/${txBundles.length}`);
        arkApi.sendTransactions(bundle);
        i++;
        if(i < txBundles.length)
            setTimeout(queuePayments, 5000);
        else
            util.log("==Payout Complete==");
    }
    queuePayments();
};

exports.startScheduler = (threshold, fee, cronJob, passphrase, secondPassphrase) => {
    console.log(`Automatic payouts scheduled: ${cronJob}`);
    const paySchedule = scheduler.scheduleJob(cronJob, () => {
        doPayout(threshold, fee, passphrase, secondPassphrase);
    });
};
