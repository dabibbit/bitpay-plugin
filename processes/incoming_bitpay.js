var SqlMqWorker = require('sql-mq-worker');
var gatewayd = require(process.env.GATEWAYD_PATH);
var IncomingProcessor = require(__dirname+'/../lib/incoming_processor');

var worker = new SqlMqWorker({
  Class: gatewayd.data.models.externalTransactions,
  predicate: { where: {
    deposit: true,
    status: 'incoming'
  }},
  timeout: 2000,
  job: function(payment, next) {
    var processor = new IncomingProcessor(payment);
    processor.run().then(next).catch(function(error) {
      console.log('ERROR!', error);
      setTimeout(next, 1000);
    })
  }
});

worker.start();

