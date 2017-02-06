var express = require('express');
var requestPromise = require('request-promise');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../db/mongoDB.js');
var keys = require('../FourSquare/config/apiKeys.js');

//SET UP FOURSQUARE API CALL WITH URL, ENDPOINT, PARAMETTERS, PHOTOS, AND AUTHORIZATION
var baseUrl = 'https://api.foursquare.com/v2/';
var endPoint = 'venues/explore/?';
var params = 'near=';
var photos = '&venuePhotos=1';
//CHANGE LIMIT TO CHANGE AMOUNT OF RESULTS THAT WE GET BACK
var auth = '&client_id='+keys.client_Id+'&client_secret='+ keys.client_Secret+'&v=20170129'+'&limit=12'+'&query=';

//USES LOCATION AND QUERY TO MAKE FOURSQUARE API CALL
router.post('/api/menus', function(req, res) {
	//if the location is two words, the foursquare api requires a '+' in between both words
	var location = req.body.location.split(' ').join('+');
	//if the keyword is two words, the foursquare api requires it to be on string with no spaces
	var query = req.body.keyword.split(' ').join('');

  requestPromise(baseUrl+endPoint+params+location+photos+auth+query).then(function(data) {
    res.send(data);
  }).catch(function(err) {
    console.log(err);
    res.json(err);
  })
});

//SENDS CALL TO GOOGLE MAPS API FOR NEW MAP
router.post('/api/menus/location', function(req, res) {
  //SETS UP URL, LOCATION, AND API KEY
  var baseGoog = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  var locGoog = req.body.location;
  var keyGoog = '&key=AIzaSyAhciEsWzSnzUfMBUMBkdkb6sjjl6Chp1k';
  var urlGoog = baseGoog + req.body.location + keyGoog;

  requestPromise(urlGoog)
  .then(function(data) {

    //PARSE DATA AND SEND BACK TO FRONT END
    var results = JSON.parse(data).results[0];
    var googleResults = {
      formalAddress: results.formatted_address,
      coordinates: results.geometry.location
    }

    res.json(googleResults);
  })
  .catch(function(err) {
    console.log(err);
    res.json(err);
  })
});

//PUTS NEW USER IN DATABASE
router.post('/api/menus/signup', function(req, res) {
  //FINDS OUT IF USER IS ALREADY IN DB
	db.users.find({username: req.body.username}, function(err, data) {
    //IF USER IS ALREADY IN DATABASE... DO NOT MAKE A NEW ONE
		if(data.length > 0) {
			res.sendStatus(404);
		} else {
			//IF USER IS NOT IN DATABASE... CREATE THEM
			var user = new db.users({username: req.body.username, password: req.body.password, recentQueries: []});
			user.save();
			res.send(req.body);
		}
	})
});

//LOGS USER IN SO THAT THEY CAN SEE RECENT SEARCHES
router.post('/api/menus/login', function(req, res) {
	//FIND USER IN DATABASE
	db.users.find({username: req.body.username, password: req.body.password}, function(err, data) {
    //IF THEY ARE IN THE DATABASE THEN SEND THE RESULTS BACK
		if(data.length > 0) {
			res.send(data)
		} else {
      //IF THEY ARE NOT IN THE DATABASE THEN SEND BACK 404 ERROR
			res.sendStatus(404);
		}
	});
});

//UPDATES USERS RECENT SEARCHES
router.post('/api/menus/updateUser', function(req, res) {
  //FINDS USER IN THE DATABASE
	db.users.find({username: req.body.username}, function(err, data) {
    //IF THE USER IS IN THE DATABASE
		if(data.length > 0) {
      //UPDATE THE RECENT SEARCHES IN THE DATABASE
			db.users.findOne({username: data[0].username}, function(err, doc) {
				doc.recentQueries = req.body.recentQueries;
				doc.save();
        //SEND BACK THE UPDATED VERSION OF THE USER
				res.send(doc)
			});
		} else {
			res.sendStatus(404);
		}
	});
});

module.exports = router;
