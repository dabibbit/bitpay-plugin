## Gatewayd Bitpay Inbound Bridge Plugin

Plugin that hooks into the express.js application server in gatewayd, and records incoming bitcoin invoices and payments as deposits using the gatewayd javascript api.

## Usage

    var BitpayGatewaydPlugin = require('bitpay-gatewayd-plugin');
    var gatewayd = require('./gatewayd/');

    var bitpayPlugin = new BitpayGatewaydPlugin({
      gatewayd: gatewayd
    });

    gatewayd.server.use(bitpayPlugin);
    
    gatewayd.server.start();

