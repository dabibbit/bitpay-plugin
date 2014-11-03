var gatewayd = require(process.env.GATEWAYD_PATH);
var ExternalAccount = gatewayd.models.externalAccounts;
var GatewayTransaction = gatewayd.models.gatewayTransactions;

module.exports = function(payment, callback) {

  gatewayd.logger.info('popped deposit', payment.toJSON());
  ExternalAccount.find(payment.external_account_id).then(function(account) {
    gatewayd.logger.info('deposit account', account.toJSON());
    if (account.type !== 'bitpay' || account.address !== 'bitpayMerchant' ) { 
      var error = 'payment not made to bitpay merchant account';
      gatewayd.logger.error(error);
      return callback(new Error(error));
    }
    
    var address = JSON.parse(payment.data.posData).rippleAddress;

    gatewayd.api.enqueueOutgoingPayment({
      address: address,
      amount: payment.amount,
      currency: payment.currency
    }, function(error, ripplePayment) {
      gatewayd.logger.info('outgoing ripple payment enqueued', ripplePayment.toJSON());
      GatewayTransaction.create({
        ripple_transaction_id: ripplePayment.id,
        external_transaction_id: payment.id,
        state: 'completed',
        policy_id: 0
      })
      .then(function() {
        return payment.updateAttributes({
          status: 'completed'
        });
      })
      .then(function() {
        callback();
      })
      .error(callback);
    });
  });

}


