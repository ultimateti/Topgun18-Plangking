var express = require('express');
var router = express.Router();

/*
   'temperature':['sensID','val','date'],
   'humidity':['sensID','val','date'],
   'gyroscope':['sensID','val_x','val_y','val_z','date'],
   'accelerometer':['sensID','val_x','val_y','val_z','date'],
   'magnetometer':['sensID','val_x','val_y','val_z','date'],
   'leds':['sensID','val','date'],
   'din':['sensID','val','date']
*/

var pressure = require("../controllers/PressureController.js");
var temperature = require("../controllers/TemperatureController.js");
var humidity = require("../controllers/HumidityController.js");
var gyroscope = require("../controllers/GyroscopeController.js");
var accelerometer = require("../controllers/AccelerometerController.js");
var magnetometer = require("../controllers/MagnetometerController.js");

var rp = require('request-promise');

router.post('/save', function(req, res) {
  temperature.save(req, res);
});

router.get('/sensor_get', function (req, res) {
	var sensor = req.query.sensor;
	console.log('hi');
	console.log(req.query);
	switch(sensor) {
	    case 'pressure':
	        pressure.filter(req.query, res);
	        break;
	    case 'temperature':
	        temperature.filter(req.query, res);
	        break;
	    case 'humidity':
	        humidity.filter(req.query, res);
	        break;
	    case 'gyroscope':
	        gyroscope.filter(req.query, res);
	        break;
	    case 'accelerometer':
	        accelerometer.filter(req.query, res);
	        break;
	    case 'magnetometer':
	        magnetometer.filter(req.query, res);
	        break;
	    case 'dummy':
	    	console.log(req.query);
	        break;
	    default:
	    	console.log('Bad access /sensor_get');
	        break;
	}

});

// Get All of that sensor
router.get('/list/:sensor', function(req, res) {
	var sensor = req.params.sensor;

		switch(sensor) {
	    case 'pressure':
	        pressure.list(req, res);
	        break;
	    case 'temperature':
	        temperature.list(req, res);
	        break;
	    case 'humidity':
	        humidity.list(req, res);
	        break;
	    case 'gyroscope':
	        gyroscope.list(req, res);
	        break;
	    case 'accelerometer':
	        accelerometer.list(req, res);
	        break;
	    case 'magnetometer':
	        magnetometer.list(req, res);
	        break;
	    case 'dummy':
	        var myRequests = [];
			  myRequests.push(rp("https://jsonplaceholder.typicode.com/posts"));

			  var allTable = [];
			  Promise.all(myRequests).then((results) => {
			    for(var i=0;i<results.length;i++) {
			      var newTable = {
			        sensor: 'posts',
			        teamID: 25,
			        keys: ['userId','id','title'],
			        data: JSON.parse(results[i])
			     };
			     allTable.push(newTable);
			    }
			    console.log(allTable.length);
			    res.render("../views/sensors", {result: [newTable],sensorName: sensor});

			  }).catch(err => console.log("ERR: " +err));
	        break;
	    default:
	    	console.log('No '+sensor);
	        break;
	}

});

module.exports = router;