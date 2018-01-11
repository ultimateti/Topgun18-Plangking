var mongoose = require("mongoose");
var Gyroscope = require("../models/Gyroscope");
var teamName = require('./TeamName');
var gyroscopeController = {};

// Show list of employees
gyroscopeController.list = function(req, res) {
  Gyroscope.find({}).exec(function (err, gyroscope) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/sensors", {result: splitTeam(gyroscope)});
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
      res.render("../views/sensors", {result: splitTeam(gyroscope)});
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

module.exports = gyroscopeController;
