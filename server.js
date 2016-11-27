


// only listen to the app once we've established a db connection
require('mongodb').MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Diagnotes', function(err, db) {
  if (err) {
    console.log('Error on db connection: ', err);
  } else {
    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();
    var twilio = require('twilio');

    var diagnose = require('./diagnose').makeDiagnosis;

    const port = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.get('/', function(req, res) {
      res.send('Hello World!');
    });

    app.get('/hello', function(req, res) {
      res.send('HI!');
    });

// Handles incoming requests from Twilio
    app.post('/sms', function(req, res) {
      var twilio = require('twilio');
      var twiml = new twilio.TwimlResponse();
      twiml.message('We have received your symptoms. You will be contacted with a diagnosis shortly');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
      console.log(req.body);
      diagnose(req.body.From, req.body.Body);
    });
    app.listen(port, function() {
      console.log('App started on localhost:%s', port);
    });
  }
});