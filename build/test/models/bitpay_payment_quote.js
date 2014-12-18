"use strict";

var BitpayPaymentQuote = require(__dirname + "/../../models/bitpay_payment_quote");
var fixtures = require(__dirname + "/../fixtures");
var assert = require("assert");

describe("Bitpay Payment Quote", function () {
  it("should save by fetching an invoice from Bitpay and persisting", function (done) {
    var quote = new BitpayPaymentQuote(fixtures.validBitpayPaymentQuote);
    quote.save({
      rippleAddress: "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"
    }).then(function (commitment) {
      assert(commitment.external_account_id > 0);
      assert(commitment.data.invoiceId);
      assert.strictEqual(commitment.data.invoiceId, commitment.uid);
      done();
    });
  });
});