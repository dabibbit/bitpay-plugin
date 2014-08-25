var httpClient = require('superagent');
var Promise = require('bluebird');

var InvalidBitpayApiKeyError = require('../errors/invalid_bitpay_api_key_error');

function BitpayInvoiceGenerator(options) {
  if (!options.apiKey) { throw new InvalidBitpayApiKeyError('options.apiKey') }
  this.apiKey = options.apiKey;
  this.gatewayd = options.gatewayd;
}

BitpayInvoiceGenerator.prototype = {
  getNewInvoice: function(invoiceOptions) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      var gatewayd = _this.gatewayd;
      if (!invoiceOptions.data || !gatewayd.validator.isRippleAddress(invoiceOptions.data.rippleAddress)) {
        reject(new Error('invalid ripple address'))
      }
      httpClient
        .post('https://bitpay.com/api/invoice')
        .auth(_this.apiKey, '')
        .send({
          price: invoiceOptions.amount,
          currency: 'BTC',
          posData: JSON.stringify({
            rippleAddress: invoiceOptions.data.rippleAddress
          })
        })
        .end(function(error, invoiceResponse) {
          if (error) {
            reject(error);
          } else {
            resolve(invoiceResponse.body); 
          }
        });
    });
  }
}

module.exports = BitpayInvoiceGenerator;

