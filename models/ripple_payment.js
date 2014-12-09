var Promise = require('bluebird');
var RipplePaymentQuote = require(__dirname+'/ripple_payment_quote');
var RippleRestClient = require('ripple-rest-client');
var RipplePathFind = require(__dirname+'/../lib/ripple_path_find');
var _ = require('lodash');


var rippleRestClient = Promise.promisifyAll(new RippleRestClient({
  api: 'https://api.ripple.com/',
  account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk'
}));

function RipplePayment(options) {
  this.destination = options.destination;
  this.source = options.source;
  this.invoice_id = options.invoice_id;
  this.memo = options.memo;
};

RipplePayment.prototype.getQuote = function getQuote() {
  var _this = this;
  return new Promise(function(resolve, reject) {
    rippleRestClient.buildPaymentAsync({
      recipient: _this.destination.address,     
      currency: _this.destination.currency,  
      amount: _this.destination.amount,  
      issuer: _this.destination.issuer
    }).then(function(response) {
      var quotes = response.payments 
      var quote = _.filter(quotes, function(quote) {
        var currencyMatches = false;
        if (quote.source_amount.currency === _this.source.currency) {
          currencyMatches = true;
        } 
        return currencyMatches;
      })[0];
      if (quote) {
        var paymentQuote = new RipplePaymentQuote(quote);
        resolve(paymentQuote);
      } else {
        reject('no quote found');
      }
    })
    .error(reject);
  });
}

module.exports = RipplePayment;

