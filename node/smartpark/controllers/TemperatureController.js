var mongoose = require("mongoose");
var temperature = require("../models/temperature");

var temperatureController = {};

// Show list of employees
temperatureController.list = function(req, res) {
  temperature.find({}).exec(function (err, temperature) {
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

      res.render("../views/sensors", {result: [newTable]});
    }
  });
};

// Time Filter
temperatureController.filter = function(req, res) {
  var time = req.daytime;
  temperature.find({}).exec(function (err, temperature) {
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

      res.render("../views/sensors", {result: [newTable]});
    }
  });
};


// Save new employee
temperatureController.save = function(req, res) {
  var temperature = new Temperature(req.body);

  temperature.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Successfully created");
    }
  });
};


module.exports = temperatureController;