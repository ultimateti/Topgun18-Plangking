var mongoose = require("mongoose");
var Gyroscope = require("../models/Gyroscope");

var gyroscopeController = {};

// Show list of employees
gyroscopeController.list = function(req, res) {
  Gyroscope.find({}).exec(function (err, gyroscope) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'gyroscope',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val_x', 'val_y', 'val_z', 'date'],
          data: gyroscope
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

gyroscopeController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Gyroscope.find({date: {$gte: startTime, $lte: times}}).exec(function (err, gyroscope) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'gyroscope',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val_x', 'val_y', 'val_z', 'date'],
          data: gyroscope
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
gyroscopeController.save = function(req) {
  Gyroscope.count(function(err, count) {
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var gyroscope = new Gyroscope(req[i]);
    
        gyroscope.save(function(err) {
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


module.exports = gyroscopeController;
