var express = require('express');
var bodyParser = require('body-parser');

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.post('/bitpay/callbacks', function(request, response){ 
  console.log(request.body);
});

app.listen(process.env.PORT);

