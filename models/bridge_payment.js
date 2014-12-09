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
  this.fee = options.fee;
  this.ripplePayment = new RipplePayment(options.ripple);
  this.externalPayment = new BitpayPayment(options.external);
}

BridgePayment.ExternalPayment = ExternalPayment;;
BridgePayment.RipplePayment = RipplePayment

BridgePayment.prototype.getQuote = function getQuote(options) {
  var _this = this;
  var rippleQuote, externalQuote;

  return new Promise(function(resolve, reject) {
    _this.ripplePayment.getQuote()
    .then(function(quote) {
      rippleQuote = quote;
      console
      var options = {
        amount: (100 - _this.fee.percent) / 100 * rippleQuote.source.amount
      }
      return _this.externalPayment.getQuote(options)
    })
    .then(function(quote) {
      externalQuote = quote;
      resolve({
        external: externalQuote,
        ripple: rippleQuote,
        fee: _this.fee
      });
    })
    .catch(reject);
  });
}

module.exports = BridgePayment;

