var Promise            = require('bluebird')
var gatewayd           = require(process.env.GATEWAYD_PATH)
var RippleTransaction  = gatewayd.models.rippleTransactions
var RippleAddress      = gatewayd.models.rippleAddresses
var GatewayTransaction = gatewayd.models.gatewayTransactions

var getHotWallet = Promise.promisify(gatewayd.api.getHotWallet)

function IncomingProcessor(externalTransaction) {
  this.payment = externalTransaction
}

IncomingProcessor.prototype.run = function() {
  var rippleTransaction, gatewayTransaction
  var externalTransaction = this.payment
  return externalTransaction.updateAttributes({
    status: 'pending'
  })
  .then(function() {
    return RippleAddress.findOrCreate({
      type: 'independent',
      managed: false,
      address: JSON.parse(externalTransaction.data.posData).rippleAddress
    })  
  })
  .then(function(destination) {
    return getHotWallet().then(function(source) {
      return RippleTransaction.create({
        state: 'pending',
        to_address_id: destination.id,
        from_address_id: source.id,
        to_amount: 1,
        to_currency: 'XRP',
        from_amount: 1,
        from_currency: 'XRP',
        direction: 'to-ripple'
      })
    })
  })
  .then(function(transaction) {
    rippleTransaction = transaction
    return GatewayTransaction.create({
      direction: 'to-ripple',
      ripple_transaction_id: rippleTransaction.id,
      external_transaction_id: externalTransaction.id,
      state: 'pending',
      policy_id: 0
    })
  })
  .then(function(transaction) {
    gatewayTransaction = transaction
    return rippleTransaction.updateAttributes({
      state: 'outgoing'
    })
  })
  .then(function() {
    return externalTransaction.updateAttributes({
      status: 'complete'
    })
  })
  .then(function() {
    return gatewayTransaction.updateAttributes({
      state: 'complete'
    })
  })
}

module.exports = IncomingProcessor;

