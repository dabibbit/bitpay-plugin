var express = require('express');
var INVOICE_BITCOINS_AMOUNT = 0.0002;
var BitpayInvoiceGenerator = require(__dirname+'/lib/bitpay_invoice_generator');
var BitpayCallbackHandler = require(__dirname+'/lib/bitpay_callback_handler');
var http = require('superagent');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = require('app');

function lookupRippleName(name, callback) {
  http.get('https://id.ripple.com/v1/authinfo?username='+name)
  .end(function(error, response) {
    if (error) { return callback(error) }
    callback(null, response.body.address)
  });
}

function BitpayPlugin(options) {
  _this = this;
  this.gatewayd = options.gatewayd;

  return app({
    gatewayd: options.gatewayd
  });
}

module.exports = BitpayPlugin;

