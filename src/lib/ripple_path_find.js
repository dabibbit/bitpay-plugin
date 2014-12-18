var Promise = require('bluebird');
var http = Promise.promisifyAll(require('superagent'));
var _ = require('lodash');

function RipplePathFind() {
}

RipplePathFind.find = function(options) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    var url = pathFindTemplate(options);

    http.get(url).endAsync(function(response) {
      resolve(response.body.payments) 
    })
    .error(reject)
  });
}

function pathFindTemplate(params) {
  return _.template('https://api.ripple.com/v1/accounts/<%=source%>/payments/paths/<%=destination%>/<%=amount%>+<%=currency%>')(params);
}


module.exports = RipplePathFind;

