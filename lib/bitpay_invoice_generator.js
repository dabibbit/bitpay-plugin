var httpClient = require('superagent');
var Promise = require('bluebird');
var gatewayd = require(process.env.GATEWAYD_PATH);

var InvalidBitpayApiKeyError = require('../errors/invalid_bitpay_api_key_error');

function BitpayInvoiceGenerator(options) {
  this.apiKey = options.gatewayd.config.get('BITPAY_API_KEY');
  if (!this.apiKey) { throw new InvalidBitpayApiKeyError() }
  this.notificationURL = options.gatewayd.config.get('BITPAY_NOTIFICATION_URL');
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
      var invoice = {
        price: invoiceOptions.amount,
        currency: 'BTC',
        notificationURL: _this.notificationURL,
        fullNotifications: true,
        posData: JSON.stringify({
          rippleAddress: invoiceOptions.data.rippleAddress
        })
      };
      httpClient
        .post('https://bitpay.com/api/invoice')
        .auth(_this.apiKey, '')
        .send(invoice)
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

