const gatewayd = require(process.env.GATEWAYD_PATH);
const ExternalAccount = gatewayd.models.externalAccounts;
const ExternalPayment = gatewayd.models.externalTransactions;

function BitpayCallbackHandler() {}

BitpayCallbackHandler.prototype = {
  accept: function(request) {
    return ExternalAccount.findOrCreate({
      type: 'bitpay',
      address: 'bitpayMerchant'
    }).then(function(account) {
      return ExternalPayment.findOrCreate({
        uid: request.body.id,
        amount: request.body.price,
        currency: request.body.currency,
        external_account_id: account.id,
        deposit: true
      })
    }).then(function(payment) {
      return payment.updateAttributes({
        status: 'incoming',
        data: request.body
      })
    })
  }
} 

module.exports = BitpayCallbackHandler;

