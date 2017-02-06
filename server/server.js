var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var routing = require('./routers/routers.js');
var path = require('path');
var app = express();
var db = require('./db/mongoDB.js');

app.set('views', __dirname + '/../src/client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/../src/client'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(routing);

//SENDS INDEX.HTML TO CLIENT ON FIRST REQUEST TO OUR PAGE
app.get('/', function(req, res) {
	res.redirect('/api/menus');
  res.render('../index.html');
});

app.listen(8080, function() {
  console.log('listening on port 8080');
});
 