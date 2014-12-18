var BridgePayment = require(__dirname+'/../models/bridge_payment');
var BitpayPayment = require(__dirname+'/../models/bitpay_payment');

module.exports.create = function(request, response, next) {

  var bridgePayment = new BridgePayment({
    ExternalPayment: BitpayPayment,
    ripple: request.body,
    external: {
      destination: {
        currency: 'BTC'
      },
      source: {
        currency: 'BTC'
      }
    },
    fee: {
      percent: 5
    }
  });

  bridgePayment.getQuote()
  .then(function(quote) {
    console.log('Brige payment quote', quote);
    return bridgePayment.commit(quote);
  })
  .then(function(payment) {
    response.status(200).send({
      bridge_payment: payment
    });
  })
  .catch(function(error) {
    response.status(500).send({
      error: error 
    });
  });
};

