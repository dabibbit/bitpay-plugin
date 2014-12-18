"use strict";

var SqlMqWorker = require("sql-mq-worker");
var gatewayd = require(process.env.GATEWAYD_PATH);
var requireAll = require("require-all");
var incomingBitpayJob = requireAll(__dirname + "/../jobs/").incoming_bitpay;

var worker = new SqlMqWorker({
  Class: gatewayd.data.models.externalTransactions,
  predicate: { where: {
      deposit: true,
      status: "incoming"
    } },
  timeout: 2000,
  job: incomingBitpayJob
});

worker.start();