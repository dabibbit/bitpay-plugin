var express = require('express');
var bodyParser = require('body-parser');
var router = require(__dirname+'/router');

module.exports = function(gatewayd) {

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/', router(gatewayd));

  app.use(cors());
  return app;
}

