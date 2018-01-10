var mongoose = require("mongoose");
var Magnetometer = require("../models/Magnetometer");

var magnetometerController = {};

// Show list of employees
magnetometerController.list = function(req, res) {
  Magnetometer.find({}).exec(function (err, magnetometer) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'gyroscope',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val_x', 'val_y', 'val_z', 'date'],
          data: magnetometer
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

magnetometerController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Magnetometer.find({date: {$gte: startTime, $lte: times}}).exec(function (err, magnetometer) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'gyroscope',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val_x', 'val_y', 'val_z', 'date'],
          data: magnetometer
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
magnetometerController.save = function(req) {
  for (var i = 0; i < req.length; i++) {
    var magnetometer = new Magnetometer(req[i]);

    magnetometer.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Successfully created");
      }
    });
  }
  
};


module.exports = magnetometerController;
