var Promise = require('bluebird');

function RipplePayment(options) {

};

RipplePayment.prototype.getQuote = function getQuote(options) {
  return new Promise(function(resolve, reject) {
    resolve(123);
  });
}

module.exports = RipplePayment;

