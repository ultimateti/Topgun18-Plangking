var mongoose = require("mongoose");
var Pressure = require("../models/Pressure");

var pressureController = {};

// Show list of employees
pressureController.list = function(req, res) {
  Pressure.find({}).exec(function (err, pressure) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'pressure',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: pressure
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

pressureController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Pressure.find({date: {$gte: startTime, $lte: times}}).exec(function (err, pressure) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'pressure',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: pressure
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
pressureController.save = function(req) {
  Pressure.count(function(err, count) {
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var pressure = new Pressure(req[i]);
    
        pressure.save(function(err) {
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


module.exports = pressureController;
