var mongoose = require("mongoose");
var Din1 = require("../models/Din1");

var din1Controller = {};

// Show list of employees
din1Controller.list = function(req, res) {
  Din1.find({}).exec(function (err, din1) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'din1',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: din1
       };

      res.render("../views/sensors", {result: [newTable], gotten: false});
    }
  });
};

din1Controller.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Din1.find({date: {$gte: startTime, $lte: times}}).exec(function (err, din1) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'din1',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: din1
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

din1Controller.save = function(req, team) {
  var tempObj = {teamID: team}
  Din1.count({teamID: team}, function(err, count) {
    console.log('WUT din ' + team + ' count ' + count)
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var din1 = new Din1(extend(tempObj, req[i]));
        din1.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('OK Naka din')
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

module.exports = din1Controller;
