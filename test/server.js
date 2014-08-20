var assert = require('assert');
var express = require('express');
var httpClient = require('supertest');
var BitpayPlugin = require(__dirname+'/../bitpay_plugin.js');
var app = express();

var bitpayGatewaydPlugin = new BitpayPlugin({
  apiKey: process.env.BITPAY_API_KEY
});

app.use('/bitpay', bitpayGatewaydPlugin);

describe('generating a bitpay invoice with the http/json api', function() {

  it('should redirect the url of an invoice', function(done) {
    httpClient(app)
      .post('/bitpay/invoices')
      .send({ amount: 0.0002 })
      .expect(302)
      .end(function(error, response){
        assert.strictEqual(response.statusCode, 302);
        assert(response.headers.location.match('https://bitpay.com/invoice?'));
        done();
      });
  });
});
