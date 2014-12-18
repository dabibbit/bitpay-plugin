"use strict";

var gatewayd = require(process.env.GATEWAYD_PATH);
var ExternalAccount = gatewayd.models.externalAccounts;
var GatewayTransaction = gatewayd.models.gatewayTransactions;
var RippleAddress = gatewayd.models.rippleAddresses;
var RippleTransaction = gatewayd.models.rippleTransactions;

module.exports = function (payment, callback) {
  gatewayd.logger.info("popped deposit", payment.toJSON());
  ExternalAccount.find(payment.external_account_id).then(function (account) {
    gatewayd.logger.info("deposit account", account.toJSON());
    if (account.type !== "bitpay" || account.address !== "bitpayMerchant") {
      var error = "payment not made to bitpay merchant account";
      gatewayd.logger.error(error);
      return callback(new Error(error));
    }

    var address = JSON.parse(payment.data.posData).rippleAddress;

    RippleAddress.findOrCreate({
      type: "independent",
      managed: false,
      address: "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"
    }).then(function (address) {
      return gatewayd.api.getHotWallet(function (error, hotWallet) {
        return RippleTransaction.create({
          to_address_id: address.id,
          from_address_id: hotWallet.id,
          to_amount: payment.amount,
          to_currency: payment.currency,
          to_issuer: address.address,
          from_amount: payment.amount,
          from_currency: payment.currency,
          from_issuer: address.address,
          state: "outgoing"
        }).then(function (ripplePayment) {
          gatewayd.logger.info("outgoing ripple payment enqueued", ripplePayment.toJSON());
          GatewayTransaction.create({
            ripple_transaction_id: ripplePayment.id,
            external_transaction_id: payment.id,
            state: "completed",
            policy_id: 0
          }).then(function () {
            return payment.updateAttributes({
              status: "completed"
            });
          }).then(function () {
            callback();
          }).error(callback);
        });
      });
    });
  });
};