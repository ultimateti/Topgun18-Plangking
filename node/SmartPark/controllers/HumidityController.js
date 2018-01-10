var mongoose = require("mongoose");
var Humidity = require("../models/Humidity");

var humidityController = {};

// Show list of employees
humidityController.list = function(req, res) {
  Humidity.find({}).exec(function (err, humidity) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'humidity',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: humidity
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

humidityController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Humidity.find({date: {$gte: startTime, $lte: times}}).exec(function (err, humidity) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'humidity',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: humidity
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
humidityController.save = function(req) {
  for (var i = 0; i < req.length; i++) {
    var humidity = new Humidity(req[i]);

    humidity.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Successfully created");
      }
    });
  }
  
};


module.exports = humidityController;
