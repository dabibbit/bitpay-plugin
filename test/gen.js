const gatewayd = require('/Users/stevenzeiler/github/ripple/gatewayd');

require('../lib/gatewayd.js')(gatewayd);
var BitpayApiError = require('../errors/bitpay_api_error.js');
var InvalidBitpayApiKeyError = require('../errors/invalid_bitpay_api_key_error.js');

gatewayd.bitpayInvoices.create({
  amount: 0.002,
  destination: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
  policy: 'deposit' 
})
.then(function(invoice) {
  console.log('BITPAY INVOICE GENERATED', invoice);
})
.catch(InvalidBitpayApiKeyError, console.log)
.catch(BitpayApiError, console.log)
.catch(function(error) {
  console.log('ERROR CREATING BITPAY INVOICE', error);
});

