var BitpayGatewaydPlugin = require('bitpay-gatewayd-plugin');

module.exports = function(gatewayd) {
  var bitpayPlugin = new BitpayGatewaydPlugin({
    gatewayd: gatewayd,
    bitpayApiKey: gatewayd.config.get('BITPAY_API_KEY')
  }); 

  gatewayd.server.use('/bitpay', bitpayPlugin);
}
