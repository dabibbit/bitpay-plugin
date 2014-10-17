const Promise = require('bluebird');
const RipplePayment = require(__dirname+'/../').models.rippleTransactions;

function BridgePayment() {

}

BridgePayment.setupBitpayPaymentToRipple = function(options) {
  // options.to_amount
  // options.from_amount
  // options.destination
  // options.tag

  return new Promise(function(resolve, reject) {
    RipplePayment.createWithAddress({
      address: options.destination,
      tag: options.tag,
      from_amount: options.from_amount,
      from_currency: 'BTC',
      to_amount: options.to_amount,
      to_currency: 'XRP',
      state: 'invoice-outgoing',
      uid: secret
    })
    .then(function(ripplePayment) {
  
      bitpayInvoiceGenerator.getNewInvoice({
        amount: options.from_amount,
        data: {
          rippleAddress: options.destination,
          secret: secret
        }
      }).then(function(invoice) {

      return ExternalAccount.findOrCreate({ name: 'bitpay', address: 'gateway' })
        .then(function(account) {

        return ExternalPayment.create({
          uid: bitpayInvoice.id,
          amount: bitpayInvoice.price,
          currency: bitpayInvoice.currency,
          data: {
            bitpayInvoice: bitpayInvoice
          },
          state: 'invoice'
        })
        .then(function(externalPayment) {
          return GatewayTransaction.create({
            external_transaction_id: externalPayment.id,
            ripple_transaction_id: ripplePayment.id
          })
        })
        .then(function(gatewayTransaction) {
          resolve(gatewayTransaction);
        })
        .error(reject);
      })
    })
    .error(reject);
  });
}

describe('Setting up an inbound payment through Bitpay to Ripple.', function() {

  it('should return a gateway transaction record', function() {

    BridgePayment.setupBitpayPaymentToRipple({
      currency: 'XRP',
      amount: 500
    })
    .then(function(gatewayTransaction) {
      assert.strictEqual(gatewayTransaction.state, 'invoice');
      
      gatewayTransaction.getRippleTransaction()
        .then(function(ripplePayment){
          assert.strictEqual(rippleTransaction.state, 'invoice');

      gatewayTransaction.getExternalTransaction()
        .then(function(externalPayment) {
          assert.strictEqual(externalPayment.state, 'invoice');
        });
      });

    });
  });
});  

