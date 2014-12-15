var assert              = require('assert')
var fixtures            = require(__dirname+'/fixtures')
var IncomingProcessor   = require(__dirname+'/../lib/incoming_processor')
var gatewayd            = require(process.env.GATEWAYD_PATH)
var ExternalTransaction = gatewayd.models.externalTransactions
var RippleTransaction   = gatewayd.models.rippleTransactions

describe('Incoming Payment Processor', function() {
  var incomingPayment

  before(function(done) {
    gatewayd.data.models.sync(function() {
      ExternalTransaction.create(fixtures.IncomingPaymentRecord)
      .then(function(transaction) {
        incomingPayment = transaction
        done()
      })
    });
  })

  it('should process the incoming payment', function(done) {
    var processor = new IncomingProcessor(incomingPayment)

    processor.run().then(function(gatewayTransaction) {
      assert.strictEqual(gatewayTransaction.state, 'complete')
      assert.strictEqual(incomingPayment.id, gatewayTransaction.external_transaction_id)

      RippleTransaction.find(gatewayTransaction.ripple_transaction_id)
        .then(function(rippleTransaction) {
          assert.strictEqual(rippleTransaction.state, 'outgoing')

          ExternalTransaction.find(gatewayTransaction.external_transaction_id) 
            .then(function(externalTransaction) {
              assert.strictEqual(externalTransaction.status, 'complete')
              done()
            })
        })
    })
  })
})

