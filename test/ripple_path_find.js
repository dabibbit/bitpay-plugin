
RipplePath = require(__dirname+'/../lib/ripple_path_find');

RipplePath.find({
  source: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
  destination: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
  currency: 'XRP',
  amount: '1' ,
})
.then(function(payments) {
  console.log(payments);
})
.catch(function(error) {
  throw new Error(error);
});

