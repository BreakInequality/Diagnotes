var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var twilio = require('twilio');

// var db = require('./config/db').createConnection();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/hello', function(req, res) {
  res.send('HI!');
});

app.post('/sms', function(req, res) {
  console.log(req.body);
  res.send('Received SMS!');
});

// TODO: listen to requests from Twilio here

app.listen(port, function() {
  console.log('App Started on localhost:3000');
});