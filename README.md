## Gatewayd Bitpay Inbound Bridge Plugin

Plugin that hooks into the express.js application server in gatewayd, and records incoming bitcoin invoices and payments as deposits using the gatewayd javascript api.

## Install

    npm install bitpay-gatewayd-plugin

## Build

    npm run build

## Test

    npm run test

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


    gatewayd.bitpayInvoices.create({
      amount: 0.002,
      destination: 'stevenzeiler',
      policy: 'deposit'  
    })
    .then(console.log)
    .error(console.log);

    gatewayd.bitpayInvoices.find({
      id: 9653
    })
    .then(console.log)
    .error(console.log)
    
    gatewayd.bitpayInvoices.pay({
      payment: { bitpayCallbackData },
      id: 9653
    })
    .then(console.log)
    .error(console.log);

    gatewayd.bitpayInvoices.delete({
      id: 9653
    })
    .then(console.log)
    .error(console.log);

