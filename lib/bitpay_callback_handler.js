function BitpayCallbackHandler(options) {
  this.gatewayd = options.gatewayd;
}

BitpayCallbackHandler.prototype = {
  accept: function(request) {
    console.log('BITPAY CALLBACK', request);
    console.log('BITPAY CALLBACK BODY', request.body);
    var requestBody = request.body;
    var gatewayd = this.gatewayd;
    var rippleAddress, externalAccount, policy;
    // record the ripple address
    gatewayd.data.models.rippleAddresses.findOrCreate({
      address: JSON.parse(requestBody.data).rippleAddress
    })
    // record the external address (bitpay invoice)
    .then(function(address) {
      rippleAddress = address;
      return gatewayd.data.models.externalAccounts.findOrCreate({
        name: 'bitpay',
        uid: requestBody.invoiceId
      })
    })
    // tie the ripple and external addresses with a policy 
    .then(function(account) {
      externalAccount = account;
      return gatewayd.data.models.policies.findOrCreate({
        ripple_address_id: rippleAddress.id,
        external_account_id: externalAccount.id
      })
    })
    // record the incoming transaction
    .then(function() { 
      return gatewayd.data.models.externalTransactions.create({
        amount:  0.002,
        currency: 'BTC',
        external_account_id: externalAccount.id
      }).complete(callback);
    })
    .error(callback);
  }
} 

module.exports = BitpayCallbackHandler;

