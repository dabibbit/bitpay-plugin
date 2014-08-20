var express = require('express');
var INVOICE_BITCOINS_AMOUNT = 0.0002;
var BitpayInvoiceGenerator = require(__dirname+'/lib/bitpay_invoice_generator');
var BitpayCAllbackHandler = require(__dirname+'/lib/bitpay_callback_handler');

function BitpayPlugin(options) {
  this.gatewayd = options.gatewayd;
  this.bitpayApiKey = options.bitpayApiKey;
  var invoiceGenerator = new BitpayInvoiceGenerator({
    apiKey: options.bitpayApiKey
  });
  var router = new express.Router();
  router.post('/callbacks', function(request, response) {
    // handle post callback from bitpay
    var bitpayCallbackHandler = new BitpayCallbackHandler();
    bitpayCallbackHandler.accept(request);
  });
  router.post('/invoices', function(request, response) {
    // create an invoice with bitpay
    invoiceGenerator.getNewInvoice({
      amount: INVOICE_BITCOINS_AMOUNT
    },
    function(error, invoice) {
      response
        .status(201)
        .send({
          invoice: invoice.url
        });
    });
  });
  return router;
}

module.exports = BitpayPlugin;

