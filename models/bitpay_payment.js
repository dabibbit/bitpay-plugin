var ExternalPayment = require(__dirname+'/external_payment');
var Promise = require('bluebird');

function BitpayPayment(options) {
  var _this = this;
  _this.destination = {};
  _this.source = {};
  ExternalPayment.call(this.options);
};

BitpayPayment.prototype = Object.create(ExternalPayment.prototype);
BitpayPayment.prototype.constructor = BitpayPayment;

BitpayPayment.prototype.getQuote = function getQuote(options) {
  var _this = this; 
  console.log('GET BITPAY QUOTE', options);
  return new Promise(function(resolve, reject) {
    _this.destination.amount = options.amount;
    _this.destination.currency = 'BTC';
    _this.source.amount = options.amount;
    _this.source.currency = 'BTC';
  
    resolve({
      destination: _this.destination,
      source: _this.source  
    });
  });
}

module.exports = BitpayPayment;

