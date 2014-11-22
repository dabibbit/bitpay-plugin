var express = require('express');
var BitpayCallbackHandler = require(__dirname+'/bitpay_callback_handler');
var BitpayInvoiceGenerator = require(__dirname+'/bitpay_invoice_generator');
var RipplePathFind = require(__dirname+'/ripple_path_find');

module.exports = function(gatewayd) {

  var router = new express.Router();

  var invoiceGenerator = new BitpayInvoiceGenerator({
    apiKey: gatewayd.config.get("BITPAY_API_KEY"),
    notificationURL: gatewayd.config.get('BITPAY_NOTIFICATION_URL'),
    gatewayd: options.gatewayd
  });

  router.get('/', function(request, response) {
    response.status(200).send({
      name: 'inbound-bitpay',
      version: '0.1',
      bridge_payments: {
        get: '/bridge_payments/ripple:<destination>/<amount>+<currency>'
      }
    });
  });

  router.param('destination', function(request, response, next, destination) {
    if (options.gatewayd.validator.isRippleAddress(destination)) {
      next();
    } else {
      lookupRippleName(destination, function(error, address) {
        if (address) {
          request.params['destination'] = address; 
          next();
        } else {
          return next(error);
        }
      });
    }
  });

  router.get('/bridge_payments/ripple::destination/:amount', function(request, response, next) {
    // look up Ripple path from hot wallet to destination
    var amount = request.params.amount.split('+')[0];
    var currency = request.params.amount.split('+')[1];

    RipplePath.find({
      source: _this.gatewayd.config.get('HOT_WALLET').address,
      destination: request.params.destination,
      amount: amount,
      currency: currency
    })
    .then(function(paths) {

      // do something with the paths
      return invoiceGenerator.getNewInvoice({
        amount: request.params.amount.split('+')[0],
        data: {
          rippleAddress: request.params.destination
        }
      }).then(function(invoice) {
        response
          .status(201)
          .send({
            invoice: invoice
          });
      })
    })
    .error(next);
  });

  router.post('/bitpay/callbacks', function(request, response) {
    var bitpayCallbackHandler = new BitpayCallbackHandler();
    bitpayCallbackHandler.accept(request)
    .then(function(payment) {
      response.status(200).send({ payment: payment });
    })
    .error(function(error) {
      response.status(500).send({ error: error});
    });
  });

  return router;
}


