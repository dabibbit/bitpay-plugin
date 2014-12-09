var RipplePayment = require(__dirname+'/ripple_payment');
var BitpayPayment = require(__dirname+'/bitpay_payment');
var ExternalPayment = require(__dirname+'/external_payment');
var Promise = require('bluebird');

function BridgePayment(options) {
  if (options) {
    if (options.ExternalPayment instanceof ExternalPayment) {
      BridgePayment.ExternalPayment = options.ExternalPayment;
    }
  }

  this.ripplePayment = new RipplePayment(options.ripple);
  this.externalPayment = new BitpayPayment(options.external);
}

BridgePayment.ExternalPayment = ExternalPayment;;
BridgePayment.RipplePayment = RipplePayment

BridgePayment.prototype.getQuote = function getQuote(options) {
  return new Promise(function(resolve, reject) {
    resolve(123);
  });
}

module.exports = BridgePayment;

