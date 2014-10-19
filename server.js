var express = require('express');
var bodyParser = require('body-parser');
var BitpayPlugin = require(__dirname+'/');
var gatewayd = require(process.env.GATEWAYD_PATH);


console.log('bitpay key', gatewayd.config.get('BITPAY_API_KEY'));

var app = new BitpayPlugin({
  gatewayd: gatewayd,
  apiKey: gatewayd.config.get('BITPAY_API_KEY'),
  notificationURL: 'https://inbound.coin-gate.com/bitpay/callbacks'
});

const port = process.env.PORT || 5000;

app.listen(port, function(error) {
  console.log('listening on port', port);
  if (error) { throw new Error(error) }
});

