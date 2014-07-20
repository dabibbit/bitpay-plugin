var express = require('express');
var INVOICE_BITCOINS_AMOUNT = 0.0003;
var BITPAY_API_KEY = process.env.BITPAY_API_KEY;
var invoiceGenerator = new BitpayInvoiceGenerator({
  bitpayApiKey: BITPAY_API_KEY
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
    invoiceGenerator.getNewInvoice({ amount: INVOICE_BITCOINS_AMOUNT })
      .complete(function(error, invoiceUrl)) {
        response.redirect(301, invoiceUrl);
      })
    });
  });
  return router;
}

module.exports = BitpayPlugin;

