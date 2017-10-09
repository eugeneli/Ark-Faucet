"use strict";
module.exports = function(app) {
    var faucet = require("../controllers/faucetController");

    //Faucet
    app.route("/api/faucet")
        .get(faucet.getInfo)
        .post(faucet.useFaucet);

    app.route("/api/faucet/status")
        .get(faucet.getStatus);

    app.route("/api/faucet/logs")
        .get(faucet.getRecentLogs);

    app.route("/api/faucet/captcha")
        .get(faucet.getCaptcha);
};
