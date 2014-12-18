"use strict";

var ExternalPayment = require(__dirname + "/external_payment");
var Promise = require("bluebird");
var gatewayd = require(process.env.GATEWAYD_PATH);

function BitpayPayment(options) {
  var _this = this;
  _this.destination = {};
  _this.source = {};
  ExternalPayment.call(this.options);
};

BitpayPayment.prototype = Object.create(ExternalPayment.prototype);
BitpayPayment.prototype.constructor = BitpayPayment;

BitpayPayment.prototype.getQuote = function getQuote(options) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.destination.amount = options.amount;
    _this.destination.currency = "BTC";
    _this.source.amount = options.amount;
    _this.source.currency = "BTC";

    resolve({
      destination: _this.destination,
      source: _this.source
    });
  });
};

BitpayPayment.prototype.commit = function (commit) {
  return new Promise(function (resolve, reject) {
    resolve({ id: 1234 });
  });
};

module.exports = BitpayPayment;