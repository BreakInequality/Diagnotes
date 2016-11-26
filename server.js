var express = require('express');
var bodyParser = require('body-parser');
var app = express();

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

// TODO: listen to requests from Twilio here

app.listen(port, function() {
  console.log('App Started on localhost:3000');
});