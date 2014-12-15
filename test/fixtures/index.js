
module.exports.validRipplePaymentQuote = {
  destination: {
    amount: 100,
    currency: 'XRP',
    address: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk'
  },
  source: {
    currency: 'BTC',
    issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
  }
}

module.exports.validBitpayPaymentQuote = {
  source: {
    amount: 0.5,
    currency: 'BTC'
  },
  destination: {
    amount: 0.5,
    currency: 'BTC'
  }
}

module.exports.IncomingPaymentRecord = { 
  data: { 
    id: 'D4s4C82upMf4j4EePDAtir',
    url: 'https://bitpay.com/invoice?id=D4s4C82upMf4j4EePDAtir',
    posData: '{"rippleAddress":"r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"}',
    status: 'confirmed',
    btcPrice: '0.0010',
    price: 0.001,
    currency: 'BTC',
    invoiceTime: 1418604411392,
    expirationTime: 1418605311392,
    currentTime: 1418604621023,
    btcPaid: '0.0010',
    rate: 1,
    exceptionStatus: false,
    buyerFields: {} 
  },
  amount: '0.001',
  currency: 'BTC',
  deposit: true,
  external_account_id: 1,
  status: 'incoming',
  ripple_transaction_id: null,
  uid: 'D4s4C82upMf4j4EePDAtir' 
}

