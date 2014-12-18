"use strict";

var httpClient = require("supertest");
var BitpayPlugin = require(__dirname + "/../../");
var assert = require("assert");
var express = require("express");
var app = express();

var gatewayd = require(process.env.GATEWAYD_PATH);

var bitpayGatewaydPlugin = new BitpayPlugin({
  apiKey: gatewayd.config.get("BITPAY_API_KEY")
});

app.use("/bitpay", bitpayGatewaydPlugin);

describe("bitpay payments http/json api", function () {
  var payment;

  it("should generate and record a bridge quote for BTC to XRP", function () {
    assert(payment.ripple.id > 0);
    assert(payment.external.id > 0);
    assert(payment.external.data.invoice_id);
    assert(payment.id);
  });

  before(function (done) {
    httpClient(app).post("/bitpay/bridge_payments").send({
      destination: {
        amount: 100,
        currency: "XRP",
        address: "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"
      },
      source: {
        currency: "BTC"
      }
    }).end(function (error, response) {
      console.log(response.body);
      assert.strictEqual(response.statusCode, 200);
      payment = response.body.bridge_payment;
      done();
    });
  });
});