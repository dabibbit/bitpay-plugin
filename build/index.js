"use strict";

var express = require("express");
var INVOICE_BITCOINS_AMOUNT = 0.0002;
var BitpayInvoiceGenerator = require("bitpay-invoice-generator");
var BitpayCallbackHandler = require(__dirname + "/lib/bitpay_callback_handler");
var bridgeQuotesController = require(__dirname + "/controllers/bridge_quotes_controller");
var bridgePaymentsController = require(__dirname + "/controllers/bridge_payments_controller");
var http = require("superagent");
var bodyParser = require("body-parser");
var cors = require("cors");
var _ = require("lodash");

function lookupRippleName(name, callback) {
  http.get("https://id.ripple.com/v1/authinfo?username=" + name).end(function (error, response) {
    if (error) {
      return callback(error);
    }
    callback(null, response.body.address);
  });
}

function BitpayPlugin(options) {
  this.gatewayd = options.gatewayd;
  this.bitpayApiKey = options.bitpayApiKey;
  var invoiceGenerator = new BitpayInvoiceGenerator({
    apiKey: options.apiKey,
    notificationURL: options.notificationURL,
    gatewayd: options.gatewayd
  });
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/", function (request, response) {
    response.status(200).send({
      name: "inbound-bitpay",
      version: "0.1",
      bridge_payments: {
        get: "/bridge_payments/:destination/:amount"
      }
    });
  });
  app.param("destination", function (request, response, next, destination) {
    if (options.gatewayd.validator.isRippleAddress(destination)) {
      next();
    } else {
      lookupRippleName(destination, function (error, address) {
        if (address) {
          request.params.destination = address;
          next();
        } else {
          return next(error);
        }
      });
    }
  });
  app.get("/bridge_payments/ripple::destination/:amount", function (request, response, next) {
    // look up Ripple path from hot wallet to destination
    invoiceGenerator.getNewInvoice({
      amount: request.params.amount.split("+")[0],
      data: {
        rippleAddress: request.params.destination
      }
    }).then(function (invoice) {
      response.status(201).send({
        invoice: invoice
      });
    }).error(next);
  });

  app.post("/bridge_quotes", bridgeQuotesController.build.bind(bridgeQuotesController));
  app.post("/bridge_payments", bridgePaymentsController.create.bind(bridgePaymentsController));

  app.post("/bitpay/callbacks", function (request, response) {
    var bitpayCallbackHandler = new BitpayCallbackHandler();
    bitpayCallbackHandler.accept(request).then(function (payment) {
      response.status(200).send({ payment: payment });
    }).error(function (error) {
      response.status(500).send({ error: error });
    });
  });

  app.use(cors());
  return app;
}

module.exports = BitpayPlugin;