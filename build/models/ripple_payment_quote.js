"use strict";

var Promise = require("bluebird");
var gatewayd = require(process.env.GATEWAYD_PATH);

function RipplePaymentQuote(payment) {
  this.destination = payment.destination;
  this.source = payment.source;
}

RipplePaymentQuote.prototype.save = function save() {
  var _this = this;
  var destinationAddress, sourceAddress;
  return new Promise(function (resolve, reject) {
    gatewayd.models.rippleAddresses.findOrCreate({
      address: _this.destination.address
    }).then(function (address) {
      destinationAddress = address;
      gatewayd.api.getHotWallet(function (error, address) {
        sourceAddress = address;
        return gatewayd.models.rippleTransactions.create({
          to_address_id: sourceAddress.id,
          from_address_id: destinationAddress.id,
          to_amount: _this.destination.amount,
          from_amount: _this.source.amount || _this.destination.amount,
          to_currency: _this.destination.currency,
          from_currency: _this.source.currency,
          to_issuer: destinationAddress.address,
          from_issuer: sourceAddress.address
        }).then(resolve)["catch"](function (error) {
          reject(error);
        });
      });
    })["catch"](reject);
  });
};

module.exports = RipplePaymentQuote;