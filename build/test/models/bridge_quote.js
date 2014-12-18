"use strict";

var BridgeQuote = require(__dirname + "/../../models/bridge_quote");
var fixtures = require(__dirname + "/../fixtures");
var assert = require("assert");

describe("Bridge Quote", function () {
  it("should persist a ripple payment and external payment", function (done) {
    var quote = new BridgeQuote({
      ripple: fixtures.validRipplePaymentQuote,
      external: fixtures.validBitpayPaymentQuote
    });

    quote.save().then(function (commitment) {
      assert(commitment.id > 0);
      assert(commitment.externalPayment.id > 0);
      assert(commitment.ripplePayment.id > 0);
      done();
    });
  });
});