"use strict";

var incomingBitpayJob = require(__dirname + "/../jobs/incoming_bitpay");

var gatewayd = require(process.env.GATEWAYD_PATH);
var ExternalAccount = gatewayd.models.externalAccounts;
var ExternalTransaction = gatewayd.models.externalTransactions;
var RippleTransaction = gatewayd.models.rippleTransactions;
var RippleAddress = gatewayd.models.rippleAddresses;
var GatewayTransaction = gatewayd.models.gatewayTransactions;
var assert = require("assert");

describe("Incoming Bitpay Job", function () {
  var bitpayMerchantAccount, bitpayPayment;

  it("should create a gateway transaction and ripple transaction", function (done) {
    incomingBitpayJob(bitpayPayment, function (error) {
      assert(!error);
      GatewayTransaction.find({ where: {
          external_transaction_id: bitpayPayment.id
        } }).then(function (gatewayTransaction) {
        assert(gatewayTransaction);
        RippleTransaction.find(gatewayTransaction.ripple_transaction_id).then(function (rippleTransaction) {
          assert(rippleTransaction);
          assert.strictEqual(rippleTransaction.to_amount, "0.005");
          assert.strictEqual(rippleTransaction.to_currency, "BTC");
          assert.strictEqual(rippleTransaction.state, "outgoing");
          RippleAddress.find(rippleTransaction.to_address_id).then(function (rippleAddress) {
            assert.strictEqual(rippleAddress.address, "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk");
            done();
          });
        });
      });
    });
  });

  before(function (done) {
    ExternalAccount.findOrCreate({
      type: "bitpay",
      address: "bitpayMerchant"
    }).then(function (account) {
      bitpayMerchantAccount = account;
      return ExternalTransaction.create({
        external_account_id: account.id,
        amount: 0.005,
        currency: "BTC",
        deposit: true,
        status: "incoming",
        data: {
          posData: JSON.stringify({
            rippleAddress: "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"
          })
        }
      });
    }).then(function (externalTransaction) {
      bitpayPayment = externalTransaction;
      done();
    });
  });

  after(function (done) {
    bitpayPayment.destroy().then(done);
  });
});