const Promise = require('bluebird');
const BitpayInvoiceGenerator = require('../lib/bitpay_invoice_generator.js');

module.exports = function(gatewayd) {
  
  gatewayd.bitpayInvoices = {

    create: function(options) {
      return new Promise(function(resolve, reject) {
        var generator = new BitpayInvoiceGenerator({
          apiKey: process.env.BITPAY_API_KEY,
          gatewayd: gatewayd
        });
        generator.getNewInvoice({
          amount: options.amount,
          data: {
            rippleAddress: options.destination
          }
        })
        .then(function(invoice) {
          // setup database records
          resolve(invoice);
        })
        .catch(reject);
      });
    },

    find: function(options) {
    }, 
  
    pay: function(options) {
    },

    delete: function(options) {
    }
  }
};

