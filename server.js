require('dotenv').load();
var express = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
var db;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  next();

});

if (process.env.NODE_ENV !== 'test') {
  db = process.env.MONGOLAB_URI;
} else {
  db = "mongodb://"+process.env.IP+"/mytest";
}

mongoose.connect(db, function(err, res) {
  if (err) {
    console.log(console.log('Error connecting to the database. ' + err));
  } else {
    console.log('Connected to Database: ' + db);
  }
});

app.use(express.static(__dirname + '/dist'));

var apiRoutes = require("./app/routes/api")(app, express);
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

module.exports = app;