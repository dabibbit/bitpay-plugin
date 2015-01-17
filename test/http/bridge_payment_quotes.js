var httpClient = require('supertest');
var BitpayPlugin = require(__dirname+'/../../');
var assert = require('assert');
var express = require('express');
var app = express();

var gatewayd = require(process.env.GATEWAYD_PATH);

var bitpayGatewaydPlugin = new BitpayPlugin({
  apiKey: gatewayd.config.get('BITPAY_API_KEY'),
  gatewayd: gatewayd
});

app.use('/bitpay', bitpayGatewaydPlugin);

describe('bitpay inbound quotes http/json api', function() {
  var quote;

  it('should generate a bridge quote for BTC to XRP', function() {
    assert.strictEqual(quote.external.source.currency, 'BTC');
    assert.strictEqual(quote.external.destination.currency, 'BTC');
    assert.strictEqual(quote.ripple.source.currency, 'BTC');
    assert.strictEqual(quote.ripple.destination.currency, 'XRP');

    assert.strictEqual(quote.external.destination.amount, quote.external.source.amount);
    assert.strictEqual(quote.ripple.source.currency, 'BTC');
    assert.strictEqual(quote.ripple.destination.amount, 100);

    assert(quote.external.source.amount > 0);
    assert(quote.external.destination.amount > 0);

    assert(quote.fee.percent >= 0);
    assert(quote.fee > 'BTC');
  });

  it('should charge a 5% fee', function() {
    assert.strictEqual(quote.ripple.source.amount * 0.95, quote.external.destination.amount);
  });

  it('the fee amount should equal the diffence between external destination and ripple source amounts', function() {
    var difference = quote.ripple.source.amount - quote.external.destination.amount;
    assert.strictEqual(difference, quote.fee.amount);
  });

  it('the fee currency should be the same as the external destination and ripple source currencies', function() {
    assert(quote.fee.currency === quote.external.destination.currency && 
           quote.fee.currency === quote.ripple.source.currency);
  });

  before(function(done) {
    httpClient(app)
      .post('/bitpay/bridge_quotes')
      .send({
        destination: {
          amount: 100,
          currency: 'XRP',
          address: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk'
        },
        source: {
          currency: 'BTC'
        }
       })
      .end(function(error, response) {
        assert.strictEqual(response.statusCode, 200);
        quote = response.body.bridge_quote;
        done();
      });
  });

});

