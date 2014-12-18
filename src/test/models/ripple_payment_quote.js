var RipplePaymentQuote = require(__dirname+'/../../models/ripple_payment_quote');
var fixtures = require(__dirname+'/../fixtures');
var assert = require('assert');

describe('Commiting a ripple payment quote', function() {

  it('should create a ripple transaction and two ripple addresses', function(done) {
    var quote = new RipplePaymentQuote(fixtures.validRipplePaymentQuote);
    quote.save().then(function(commitment) {
      assert(commitment.to_address_id > 0);
      assert(commitment.from_address_id > 0);
      done();
    });
  });
});

