
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

