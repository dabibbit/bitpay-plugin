var Promise = require('bluebird')
var InvoiceGenerator = require('bitpay-invoice-generator')

var invoiceGenerator = new InvoiceGenerator({
  apiKey: process.env['BITPAY_API_KEY'],
  notificationURL: 'https://stevenzeiler.com/bitpay/callbacks'
})

class PaymentQuote {
  constructor(params) {
    this.destination = params.destination
  }
}

PaymentQuote.prototype.save = function save() {
  return new Promise(function(resolve, reject) {
    invoiceGenerator.getNewInvoice({
      amount: destination.amount,
      data: {
        rippleAddress: destination.address
      }
    })
    .then(function(invoice) {
      _this.destination.invoice_id = invoice.id
      _this.destination.invoice_url = invoice.url
      resolve({
        destination: _this.destination
      })
    })
    .catch(reject)
  })
}

PaymentQuote.prototype.fetch = function fetch() {
  return new Promise(function(resolve, reject) {
    resolve(this.destination)
  })
}

module.exports = PaymentQuote

