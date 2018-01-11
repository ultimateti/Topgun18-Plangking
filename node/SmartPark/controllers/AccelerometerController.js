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

accelerometerController.filterRange = function(start_time, end_time, callback) {
  Accelerometer.find({date: {$gte: start_time, $lte: end_time}}).exec(function (err, accelerometer) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      callback(accelerometer)
    }
  });
}

accelerometerController.save = function(req, team) {
  var tempObj = {teamID: team}
  Accelerometer.count({teamID: team}, function(err, count) {
    console.log('WUT acc ' + team + ' count ' + count)
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var accelerometer = new Accelerometer(extend(tempObj, req[i]));
        accelerometer.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('OK Naka acc')
          }
        });
      }
    }
  })
};

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
      for (var prop in source) {
          target[prop] = source[prop];
      }
  });
  return target;
}

module.exports = accelerometerController;
