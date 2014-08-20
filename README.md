## Gatewayd Bitpay Inbound Bridge Plugin

Plugin that hooks into the express.js application server in gatewayd, and records incoming bitcoin invoices and payments as deposits using the gatewayd javascript api.

## Usage

In the `Gatewaydfile.js` of your gatewayd installation:

    var BitpayGatewaydPlugin = require('bitpay-gatewayd-plugin');

    module.exports = function(gatewayd) {
      var bitpayPlugin = new BitpayGatewaydPlugin({
        gatewayd: gatewayd,
        bitpayApiKey: gatewayd.config.get('BITPAY_API_KEY')
      }); 

      gatewayd.server.use('/bitpay', bitpayPlugin);
    }

The `bitpayPlugin` object is simply an instance of the express.js Router class.

