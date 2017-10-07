"use strict";
module.exports = function(app) {
    var faucet = require("../controllers/faucetController");

    //Faucet
    app.route("/api/faucet")
        .get(faucet.getByAddress);
};
