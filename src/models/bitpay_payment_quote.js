var Promise = require('bluebird');
var BitpayInvoiceGenerator = require(__dirname+'/../lib/bitpay_invoice_generator');
var gatewayd = require(process.env.GATEWAYD_PATH);

var invoiceGenerator = new BitpayInvoiceGenerator({
  gatewayd: gatewayd
}); 

function BitpayPaymentInvoice(options) {
  this.destination = options.destination;
  this.source = options.source;
}

BitpayPaymentInvoice.prototype.save = function save(options) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    invoiceGenerator.getNewInvoice({
      amount: _this.destination.amount,
      data: {
        rippleAddress: options.rippleAddress
      }
    })
    .then(function(invoice) {
      return gatewayd.models.externalAccounts.findOrCreate({
        type: 'bitpay',
        address: 'bitpayMerchant'
      }).then(function(account) {
        return gatewayd.models.externalTransactions.create({
          external_account_id: account.id,
          deposit: true,
          amount: _this.destination.amount,
          currency: 'BTC',
          uid: invoice.id,
          data: { invoiceId: invoice.id }
        })
      })
    })
    .then(resolve)
    .catch(reject);
  });
}

module.exports = BitpayPaymentInvoice;

