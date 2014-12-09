
function RipplePaymentQuote(payment) {
  this.destination = {
    amount: parseFloat(payment.destination_amount.value),
    currency: payment.destination_amount.currency,
    issuer: payment.destination_amount.issuer
  };
  this.source = {
    amount: parseFloat(payment.source_amount.value),
    currency: payment.source_amount.currency,
    issuer: payment.source_amount.issuer
  };
}

module.exports = RipplePaymentQuote;

