"use strict";

function BitpayApiError() {}
BitpayApiError.prototype = Object.create(Error.prototype);

module.exports = BitpayApiError;