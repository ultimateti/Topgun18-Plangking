var mongoose = require("mongoose");
var Magnetometer = require("../models/Magnetometer");
var teamName = require('./TeamName');
var magnetometerController = {};

// Show list of employees
magnetometerController.list = function(req, res) {
  Magnetometer.find({}).exec(function (err, magnetometer) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/sensors", {result: splitTeam(magnetometer)});
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
      res.render("../views/sensors", {result: splitTeam(magnetometer)});
    }
  });
};

// // Save new employee
magnetometerController.save = function(req) {
  Magnetometer.count(function(err, count) {
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var magnetometer = new Magnetometer(req[i]);
    
        magnetometer.save(function(err) {
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


function splitTeam(teamArray) {
  var allTable = [];
  var lastTeam = 0;
  teamArray.sort((a, b) => a.teamID - b.teamID);
  for(var i=0;i<teamArray.length;i++) {
    if(teamArray[i].teamID != lastTeam) {
      
        allTable.push({
          sensor: teamArray[i].sensor,
          teamID: teamName[teamArray[i].teamID],
          keys: ['sensID','val_x','val_y','val_z','date'],
          data: [teamArray[i]]
       });
    } else {
        allTable[allTable.length-1].data.push(teamArray[i]);
    }
    lastTeam = teamArray[i].teamID;
  }
  return allTable;
}

module.exports = magnetometerController;
