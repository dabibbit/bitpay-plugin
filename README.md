## Gatewayd Bitpay Inbound Bridge Plugin

Plugin that hooks into the express.js application server in gatewayd, and records incoming bitcoin invoices and payments as deposits using the gatewayd javascript api.

## Usage

    var BitpayGatewaydPlugin = require('bitpay-gatewayd-plugin');
    var gatewayd = require('./gatewayd/');
    var bitpayApiKey = process.env.BITPAY_API_KEY;

    var bitpayPlugin = new BitpayGatewaydPlugin({
      gatewayd: gatewayd,
      bitpayApiKey: bitpayApiKey
    });

    gatewayd.server.use('/bitpay', bitpayPlugin);
    
    gatewayd.server.start();

The `bitpayPlugin` object is simply an instance of the express.js Router class.

