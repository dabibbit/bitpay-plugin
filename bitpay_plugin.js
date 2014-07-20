var express = require('express');
var INVOICE_BITCOINS_AMOUNT = 0.0002;
var BITPAY_API_KEY = process.env.BITPAY_API_KEY;
var BitpayInvoiceGenerator = require(__dirname+'/lib/bitpay_invoice_generator');
var invoiceGenerator = new BitpayInvoiceGenerator({
  apiKey: BITPAY_API_KEY
});

function BitpayPlugin(options) {
  var router = new express.Router();
  router.post('/callbacks', function(request, response) {
    // handle post callback from bitpay
    var bitpayCallbackHandler = new BitpayCallbackHandler();
    bitpayCallbackHandler.handleCallback(request);
  });
  router.post('/invoices', function(request, response) {
    // create an invoice with bitpay
    invoiceGenerator.getNewInvoice({
      amount: INVOICE_BITCOINS_AMOUNT
    },
    function(error, invoice) {
      response.redirect(invoice.url);
    });
  });
  return router;
}

module.exports = BitpayPlugin;

