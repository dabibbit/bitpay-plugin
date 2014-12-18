"use strict";

var BridgePayment = require(__dirname + "/../models/bridge_payment");
var BitpayPayment = require(__dirname + "/../models/bitpay_payment");

module.exports.build = function (request, response, next) {
  var bridgePayment = new BridgePayment({
    ExternalPayment: BitpayPayment,
    ripple: request.body,
    external: {
      destination: {
        currency: "BTC"
      },
      source: {
        currency: "BTC"
      }
    },
    fee: {
      percent: 5
    }
  });

  bridgePayment.getQuote().then(function (quote) {
    response.status(200).send({
      bridge_quote: quote
    });
  })["catch"](function (error) {
    response.status(500).send({
      error: error
    });
  });
};