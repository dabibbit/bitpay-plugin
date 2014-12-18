var BitpayPaymentQuote = require(__dirname+'/../lib/bitpay_payment_quote')
var assert = require('assert')

describe('Implementation of BridgePaymentQuote for bitpay', function() {

  it('should build a quote with no fee', function(done) {

    var quote = new BitpayPaymentQuote({
      destination: {
        currency: 'BTC',
        amount: '0.05'
      }
    })
  
    quote.fetch().then(function() {
      var destination = quote['destination']
      var source      = quote['source']
      
      assert.strictEqual(destination.currency, 'BTC')
      assert.strictEqual(destination.amount, '0.05')
      assert(!destination.address)
      assert(!source)
      done()
    })
  })

  it.skip('should reject a quote over the limit', function(done) {
    var LimitExceeded = BitpayPaymentQuote.Errors.LimitExceeded;

    BitpayPaymentQuote.setLimit(0.05)

    var quote = new BitpayPaymentQuote({
      destination: {
        currency: 'BTC',
        amount: '0.06'
      }
    })

    quote.fetch().catch(LimitExceeded, function(error) {
      assert(error instanceof LimitExceeded)

      quote.amount = 0.04
      quote.fetch().then(function() {
        assert(true)
        done()
      })
    })
  })

  it('should save to get a destination address and invoice', function(done) {
    console.log('BPQ', BitpayPaymentQuote)

    var quote = new BitpayPaymentQuote({
      destination: {
        currency: 'BTC',
        amount: '0.05'
      }
    })

    console.log('QUOTE1', quote)
    
    quote.save().then(function() {
      var destination = quote.destination

      assert.strictEqual(destination.currency, 'BTC')
      assert.strictEqual(destination.amount, 'BTC')
      assert(destination.address)
      assert(destination.invoice_id)
      assert(destination.invoice_url)
      assert(!source)
      done()
    })
  })
})

