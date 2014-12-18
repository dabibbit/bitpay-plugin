"use strict";

var RipplePayment = require(__dirname + "/ripple_payment");
var BitpayPayment = require(__dirname + "/bitpay_payment");
var ExternalPayment = require(__dirname + "/external_payment");
var Promise = require("bluebird");
var gatewayd = require(process.env.GATEWAYD_PATH);

function BridgePayment(options) {
  if (options) {
    if (options.ExternalPayment instanceof ExternalPayment) {
      BridgePayment.ExternalPayment = options.ExternalPayment;
    }
  }
  this.fee = options.fee;
  this.ripplePayment = new RipplePayment(options.ripple);
  this.externalPayment = new BitpayPayment(options.external);
}

BridgePayment.ExternalPayment = ExternalPayment;;
BridgePayment.RipplePayment = RipplePayment;

BridgePayment.prototype.getQuote = function getQuote(options) {
  var _this = this;
  var rippleQuote, externalQuote;

  return new Promise(function (resolve, reject) {
    _this.ripplePayment.getQuote().then(function (quote) {
      rippleQuote = quote;
      var options = {
        amount: (100 - _this.fee.percent) / 100 * rippleQuote.source.amount
      };
      return _this.externalPayment.getQuote(options);
    }).then(function (quote) {
      externalQuote = quote;
      _this.fee.amount = rippleQuote.source.amount - externalQuote.destination.amount;
      _this.fee.currency = rippleQuote.source.currency;
      console.log("FEE", _this.fee);
      resolve({
        external: externalQuote,
        ripple: rippleQuote,
        fee: _this.fee
      });
    })["catch"](reject);
  });
};

BridgePayment.prototype.commit = function commit(quote) {
  var _this = this;
  var rippleTransaction, externalTransaction;
  return new Promise(function (resolve, reject) {
    _this.ripplePayment.commit(quote.ripple).then(function (record) {
      rippleTransaction = record;
      return _this.externalPayment.commit(quote.external);
    }).then(function (record) {
      externalTransaction = record;
      return gatewayd.models.gatewayTransactions.create({
        state: "pending",
        external_transaction_id: externalTransaction.id,
        ripple_transaction_id: rippleTransaction.id });
    }).then(function (gatewayTransaction) {
      gatewayTransaction.external = externalTransaction;
      gatewayTransaction.ripple = rippleTransaction;
      resolve(gatewayTransaction);
    })["catch"](error);
  });
};

module.exports = BridgePayment;