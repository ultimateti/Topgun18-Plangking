var mongoose = require("mongoose");
var Accelerometer = require("../models/Accelerometer");

var accelerometerController = {};

// Show list of employees
accelerometerController.list = function(req, res) {
  Accelerometer.find({}).exec(function (err, accelerometer) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'accelerometer',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val_x', 'val_y', 'val_z', 'date'],
          data: accelerometer
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

accelerometerController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = (new Date(times)).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  console.log(times)
  console.log(valtime)
  console.log(startTime)
  Accelerometer.find({date: {$gte: startTime, $lte: times}}).exec(function (err, accelerometer) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'accelerometer',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val_x', 'val_y', 'val_z', 'date'],
          data: accelerometer
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
accelerometerController.save = function(req) {
  Accelerometer.count(function(err, count) {
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var accelerometer = new Accelerometer(req[i]);
    
        accelerometer.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("Successfully created");
          }
        });
      }
    }
  })
};


module.exports = accelerometerController;
