var Promise = require('bluebird');
var RipplePaymentQuote = require(__dirname+'/ripple_payment_quote');
var ExternalPaymentQuote = require(__dirname+'/bitpay_payment_quote');
var gatewayd = require(process.env.GATEWAYD_PATH);

function BridgeQuote(options) {
  this.ripple = options.ripple; 
  this.external = options.external;
  this.rippleQuote = new RipplePaymentQuote(options.ripple);
  this.externalQuote = new ExternalPaymentQuote(options.external);
}

BridgeQuote.prototype.save = function save() {
  var _this = this;
  return new Promise(function(resolve, reject) {
    var rippleCommitment, externalCommitment;
    _this.rippleQuote.save().then(function(commitment) {
      rippleCommitment = commitment;
      return _this.externalQuote.save({
        rippleAddress: _this.ripple.destination.address
      })
    }) 
    .then(function(commitment) {
      externalCommitment = commitment;
      return gatewayd.models.gatewayTransactions.create({
        external_transaction_id: externalCommitment.id,
        ripple_transaction_id: rippleCommitment.id,
        policy_id: 0,
        direction: 'to-ripple',
        state: 'pending'
      });
    })
    .then(function(commitment) {
      commitment.externalPayment = externalCommitment;
      commitment.ripplePayment = rippleCommitment;
      resolve(commitment);
    })
    .catch(reject)
  });
}

module.exports = BridgeQuote;

