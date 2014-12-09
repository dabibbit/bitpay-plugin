var assert = require('assert');
var BridgePayment = require(__dirname+'/../../models/bridge_payment');
var BitpayPayment = require(__dirname+'/../../models/bitpay_payment');

describe('BridgePayment Model', function() {
  var brigePayment;

  before(function() {    
    bridgePayment = new BridgePayment({
      ExternalPayment: BitpayPayment,
      direction: 'inbound',
      external: {
        type: 'bitpay',
        source: {
          currency: 'BTC'
        },
        destionation: {
          currency: 'BTC'
        }
      },
      ripple: {
        source: {
          currency: 'BTC',
          issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
        },
        destination: {
          address: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
          tag: 234,
          invoice_id: '123234234234343',
          currency: 'XRP',
          amount: 10000
        }
      }
    });
  });

  it('ripplePayment should be an instance of RipplePayment', function() {
    assert(bridgePayment.ripplePayment instanceof BridgePayment.RipplePayment);
  }); 

  it('externalPayment should be an instance of BitpayPayment', function() {
    assert(bridgePayment.externalPayment instanceof BitpayPayment);
  }); 

  describe('Getting a quote from the ripple network', function(done) {

    
    it.skip('should get a quote from BTC to XRP', function(done) {

      bridgePayment.ripplePayment.getQuote().then(function(ripplePaymentQuote) {
        assert.strictEqual(ripplePaymentQuote.destination.amount, 10000);
        assert.strictEqual(ripplePaymentQuote.destination.currency, 'XRP');
        assert(ripplePaymentQuote.destination.amount > 0);
        assert.strictEqual(ripplePaymentQuote.source.currency, 'BTC');
        assert.strictEqual(ripplePaymentQuote.source.issuer, 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q');
        done();
      });
    });
  });

  describe('Getting a quote from the bitpay network', function() {

    it.skip('should get a quote from BTC to BTC for the same amount', function(done) {
      bridgePayment.externalPayment.getQuote({
        source_amount: 1,
        destination_amount: 1
      }).then(function(bitpayPaymentQuote) {
        assert.strictEqual(bitpayPaymentQuote.source_amount, 1),
        assert.strictEqual(bitpayPaymentQuote.destination_amount, 1),
        done();
      });
    });
  });

  describe('Commiting to the bitpay payment quote', function() {

    it.skip('should store an invoice_id generated from the Bitpay Invoice API', function(done) {
      bridgePayment.externalPayment.getQuote().then(function(bitpayPaymentQuote) {

        bridgePayment.externalPayment.commit(quote).then(function(bridgePaymentCommitment) {
          assert(commitment instanceof BridgePayment.ExternalPayment.Commitment); 
          assert(commitment.invoice_id);
          assert(commitment.id > 0);
          assert.strictEqual(commitment.source_amount, commitment.destination_amount);
          assert.strictEqual(commitment.source_amount, commitment.destination_amount);
          done();
        });
      });
    });
  });
});

