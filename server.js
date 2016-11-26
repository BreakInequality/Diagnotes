var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('./config/db').createConnection();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/hello', function(req, res) {
  res.send('HI!');
});

app.listen(3000, function() {
  console.log('App Started on localhost:3000');
});