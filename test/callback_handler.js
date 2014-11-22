const bitpayResponse = require(__dirname+"/fixtures/bitpay_callback.js");
const BitpayCallbackHandler = require(__dirname+'/../lib/bitpay_callback_handler.js');
const assert = require('assert');

describe('Gateway Transaction associtations', function() {

  it('should get the external payment', function() {

  });

  it('should get the ripple payment', function() {

  });

});

describe('Bitpay Callback Handler', function() {
  
  before(function() {
    handler = new BitpayCallbackHandler();
  });

  it('should mark the external transaction as incoming', function() {

    assert.strictEqual(externalPayment.uid, bitpayResponse.id);

    ExternalTransaction.find({ where: { uid: bitpayResponse.id }})
      .then(function(externalTransaction) {

      externalTransaction.updateAttributes({
        status: 'incoming' 
      });
    }); 
    
    handler.acceptCallback(bitpayResponse).then(function(externalPayment) {
      assert.strictEqual(externalPayment.status, 'incoming');
    });; 
  });
  
  it('should attach its data to the ripple transaction data', function() {

    assert.strictEqual(externalPayment.data.bitpayResponse, bitpayResponse);
  });
});

