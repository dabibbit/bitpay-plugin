var httpClient = require('superagent');

function BitpayInvoiceGenerator(options) {
  if (!options.apiKey) { return new Error('BitpayApiKeyNotFound') }
  this.apiKey = options.apiKey;
}

BitpayInvoiceGenerator.prototype = {
  getNewInvoice: function(invoiceOptions, callback) {
    var self = this;
    httpClient
      .post('https://bitpay.com/api/invoice')
      .auth(self.apiKey, '')
      .send({
        price: invoiceOptions.amount,
        currency: 'BTC'
      })
      .end(function(error, invoiceResponse) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, invoiceResponse.body); 
        }
      });
  }
}

module.exports = BitpayInvoiceGenerator;

