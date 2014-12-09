var assert = require('assert');
var BitpayInvoiceGenerator = require(__dirname+'/../lib/bitpay_invoice_generator.js');
var gatewayd = require(process.env.GATEWAYD_PATH);
var BITPAY_API_KEY = gatewayd.config.get('BITPAY_API_KEY');

describe('Bitpay Invoice Generator', function() {
  
  it('should be initialized with a bitpay api key', function() {
    var bitpayInvoiceGenerator = new BitpayInvoiceGenerator({
      apiKey: BITPAY_API_KEY
    });
  });

  it('should throw an error if no api key is included', function() {
    assert.throws(function() {
      var bitpayInvoiceGenerator = new BitpayInvoiceGenerator();
    }, Error);
  });

  it('should generate a new invoice and return the invoice url', function(done) {
    var bitpayInvoiceGenerator = new BitpayInvoiceGenerator({
      apiKey: BITPAY_API_KEY,
      gatewayd: gatewayd
    });

    bitpayInvoiceGenerator.getNewInvoice({
      data: {
        rippleAddress: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk'
      },
      amount: 0.0002
    })
    .then(function(invoice) {
      assert.strictEqual(invoice.status, 'new');
      assert.strictEqual(invoice.price, 0.0002);
      assert.strictEqual(invoice.currency, 'BTC');
      assert.strictEqual(invoice.url, 'https://bitpay.com/invoice?id='+invoice.id);
      done();
    })
    .catch(function(error) {
      console.log('ERROR', error);
    });
  });

});

