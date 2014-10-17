var express = require('express');
var INVOICE_BITCOINS_AMOUNT = 0.0002;
var BitpayInvoiceGenerator = require(__dirname+'/lib/bitpay_invoice_generator');
var BitpayCAllbackHandler = require(__dirname+'/lib/bitpay_callback_handler');
var http = require('superagent');
var bodyParser = require('body-parser');
var cors = require('cors');

function lookupRippleName(name, callback) {
  http.get('https://id.ripple.com/v1/authinfo?username='+name)
  .end(function(error, response) {
    if (error) { return callback(error) }
    callback(null, response.body.address)
  });
}

function BitpayPlugin(options) {
  this.gatewayd = options.gatewayd;
  this.bitpayApiKey = options.bitpayApiKey;
  var invoiceGenerator = new BitpayInvoiceGenerator({
    apiKey: options.bitpayApiKey,
    notificationURL: options.notificationURL,
    gatewayd: options.gatewayd
  });
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/', function(request, response) {
    response.status(200).send({
      name: 'inbound-bitpay',
      version: '0.1',
      bridge_payments: {
        get: '/bridge_payments/:destination/:amount'
      }
    });
  });
  app.param('destination', function(request, response, next, destination) {
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
  app.get('/bridge_payments/ripple::destination/:amount', function(request, response, next) {
    // look up Ripple path from hot wallet to destination
    invoiceGenerator.getNewInvoice({
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
    .error(next);
  });
  app.post('/bitpay/callbacks', function(request, response) {
    // handle post callback from bitpay
    console.log(request.body);
    response.status(200).send();
    //var bitpayCallbackHandler = new BitpayCallbackHandler();
    //bitpayCallbackHandler.accept(request);
  });
  app.use(cors());
  return app;
}

module.exports = BitpayPlugin;

