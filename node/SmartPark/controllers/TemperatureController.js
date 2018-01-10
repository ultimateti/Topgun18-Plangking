var mongoose = require("mongoose");
var Temperature = require("../models/Temperature");

var temperatureController = {};

// Show list of employees
temperatureController.list = function(req, res) {
  Temperature.find({}).exec(function (err, temperature) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'temperature',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: temperature
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

temperatureController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Temperature.find({date: {$gte: startTime, $lte: times}}).exec(function (err, temperature) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'temperature',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: temperature
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
temperatureController.save = function(req) {
  for (var i = 0; i < req.length; i++) {
    var temperature = new Temperature(req[i]);

    temperature.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Successfully created");
      }
    });
  }
  
};


module.exports = temperatureController;
