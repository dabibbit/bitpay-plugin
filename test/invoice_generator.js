var assert = require('assert');
var BitpayInvoiceGenerator = require(__dirname+'/../lib/bitpay_invoice_generator.js');
var BITPAY_API_KEY = process.env.BITPAY_API_KEY;

describe('Bitpay Invoice Generator', function() {
  
  it('should be initialized with a bitpay api key', function() {
    var bitpayInvoiceGenerator = new BitpayInvoiceGenerator({
      apiKey: process.env.BITPAY_API_KEY
    });
  });

  it('should throw an error if no api key is included', function() {
    assert.throws(function() {
      var bitpayInvoiceGenerator = new BitpayInvoiceGenerator();
    }, Error);
  });

  it('should generate a new invoice and return the invoice url', function(done) {
    var bitpayInvoiceGenerator = new BitpayInvoiceGenerator({
      apiKey: BITPAY_API_KEY
    });

    bitpayInvoiceGenerator.getNewInvoice({
      amount: 0.0002
    }, function(error, invoice) {
      assert.strictEqual(invoice.status, 'new');
      assert.strictEqual(invoice.price, 0.0002);
      assert.strictEqual(invoice.currency, 'BTC');
      assert.strictEqual(invoice.url, 'https://bitpay.com/invoice?id='+invoice.id);
      done();
    });
  });

});

