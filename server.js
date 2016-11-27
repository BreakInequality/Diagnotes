


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
      require('./diagnose').getResponse(req.body, db, function(twimlResponse) {
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twimlResponse.toString());
      });
    });

    app.get('/diagnose', function(req, res) {
      sendPendingDiagnoses(db, res);
    });

    app.listen(port, function() {
      console.log('App started on localhost:%s', port);
    });
  }

});


var sendPendingDiagnoses = function(db, response) {
  db.collection('patients').find({'diagnosis': {$exists: true}}, function(err, docs) {
    if (err) {
      console.log('Error while fetching pending diagnoses: ', err);
    } else {
      response.json(docs);
    }
  });
};