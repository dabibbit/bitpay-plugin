"use strict";

var assert = require("assert");
var BridgePayment = require(__dirname + "/../../models/bridge_payment");
var BitpayPayment = require(__dirname + "/../../models/bitpay_payment");
var RipplePayment = require(__dirname + "/../../models/ripple_payment");
var RipplePaymentQuote = require(__dirname + "/../../models/ripple_payment_quote");

describe("BridgePayment Model", function () {
  var bridgePayment;

  it("ripplePayment should be an instance of RipplePayment", function () {
    assert(bridgePayment.ripplePayment instanceof BridgePayment.RipplePayment);
  });

  it("externalPayment should be an instance of BitpayPayment", function () {
    assert(bridgePayment.externalPayment instanceof BitpayPayment);
  });

  describe("Getting a quote from the ripple network", function (done) {
    it("should get a quote from BTC to XRP", function (done) {
      bridgePayment.ripplePayment.getQuote().then(function (ripplePaymentQuote) {
        assert(ripplePaymentQuote instanceof RipplePaymentQuote);

        assert.strictEqual(ripplePaymentQuote.destination.amount, 1);
        assert.strictEqual(ripplePaymentQuote.destination.currency, "XRP");
        assert(ripplePaymentQuote.destination.amount > 0);
        assert.strictEqual(ripplePaymentQuote.source.currency, "BTC");
        assert(ripplePaymentQuote.source.amount > 0);
        done();
      });
    });
  });

  describe("Getting a quote from the bitpay network", function () {
    it("should get a quote from BTC to BTC for the same amount", function (done) {
      bridgePayment.externalPayment.getQuote({
        amount: 1
      }).then(function (bitpayPaymentQuote) {
        assert.strictEqual(bitpayPaymentQuote.source.amount, 1);
        assert.strictEqual(bitpayPaymentQuote.destination.amount, 1);
        done();
      });
    });
  });

  describe("Commiting to the ripple payment quote", function () {
    it("should store the ripple payment record in the database", function (done) {
      bridgePayment.ripplePayment.getQuote().then(function (quote) {
        return bridgePayment.ripplePayment.commit(quote);
      }).then(function (quote) {
        assert(quote.id > 0);
        done();
      });
    });
  });

  describe("Commiting to the bitpay payment quote", function () {
    it("should store an invoice_id generated from the Bitpay Invoice API", function (done) {
      bridgePayment.externalPayment.getQuote({
        amount: 1
      }).then(function (quote) {
        bridgePayment.externalPayment.commit(quote).then(function (commitment) {
          console.log("COMMITMENT", commitment);
          assert(commitment.id > 0);
          assert(commitment.data.invoice_id);
          done();
        });
      });
    });

    describe("Commiting to the bridge payment quote", function () {
      it("create a gateway transaction, ripple transaction, and external transaction", function () {
        bridgePayment.getQuote().then(function (quote) {
          return bridgePayment.commit(quote);
        }).then(function (gatewayTransaction) {
          assert(gatewayTransaction.id > 0);
          assert(gatewayTransaction.rippleTransaction.id > 0);
          assert(gatewayTransaction.externalTransaction.id > 0);
          assert(gatewayTransaction.externalTransaction.data.invoice_id);
        });
      });
    });
  });

  before(function () {
    bridgePayment = new BridgePayment({
      ExternalPayment: BitpayPayment,
      direction: "inbound",
      external: {
        type: "bitpay",
        source: {
          currency: "BTC"
        },
        destionation: {
          currency: "BTC"
        }
      },
      ripple: {
        source: {
          currency: "BTC" },
        destination: {
          address: "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
          tag: 234,
          invoice_id: "123234234234343",
          currency: "XRP",
          amount: 1
        }
      }
    });
  });
});