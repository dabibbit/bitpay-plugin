var ExternalPayment = require(__dirname+'/external_payment');

function BitpayPayment(options) {

  ExternalPayment.call(this.options);
};

BitpayPayment.prototype = Object.create(ExternalPayment.prototype);
BitpayPayment.prototype.constructor = BitpayPayment;

module.exports = BitpayPayment;

