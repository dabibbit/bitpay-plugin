var assert = require('assert');
var ExternalPayment = require(__dirname+'/../../models/external_payment');
var BitpayPayment = require(__dirname+'/../../models/bitpay_payment');

describe('Bitpay Payment', function() {

  it('should inherit from ExternalPayment', function() {

    bitpayPayment = new BitpayPayment({});
  
    assert(bitpayPayment instanceof ExternalPayment);
    assert(bitpayPayment instanceof BitpayPayment);
  }); 
});

