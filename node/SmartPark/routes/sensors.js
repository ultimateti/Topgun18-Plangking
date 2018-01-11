var express = require('express');
var router = express.Router();

var temperature = require("../controllers/TemperatureController.js");
var accelerometer = require("../controllers/AccelerometerController.js");
var din1 = require("../controllers/Din1Controller.js");

router.post('/save', function(req, res) {
  temperature.save(req, res);
});

router.get('/sensor_get', function (req, res) {
	var sensor = req.query.sensor;
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
	    case 'din1':
	        din1.filter(req.query, res);
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
	    case 'din1':
	        din1.list(req, res);
	        break;
	    default:
	    	console.log('No '+sensor);
	        break;
	}

});



module.exports = router;