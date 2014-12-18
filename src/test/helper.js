var httpClient = require('supertest');
var BitpayPlugin = require(__dirname+'/../');
var assert = require('assert');
var express = require('express');
var gatewayd = require(process.env.GATEWAYD_PATH);

module.exports.app = (function() {
  var app = express();

  var bitpayGatewaydPlugin = new BitpayPlugin({
    apiKey: gatewayd.config.get('BITPAY_API_KEY')
  });

  app.use('/bitpay', bitpayGatewaydPlugin);

  return app;
})();

