var express = require('express');
var bodyParser = require('body-parser');
var BitpayPlugin = require(__dirname+'/');
var gatewayd = require(process.env.GATEWAYD_PATH);

var app = new BitpayPlugin({
  gatewayd: gatewayd,
  bitpayApiKey: gatewayd.config.get('BITPAY_API_KEY'),
  notificationURL: 'https://inbound.coin-gate.com/bitpay/callbacks'
});

app.listen(process.env.PORT, function(error) {
  console.log('listening on port', process.env.PORT);
  if (error) { throw new Error(error) }
});

