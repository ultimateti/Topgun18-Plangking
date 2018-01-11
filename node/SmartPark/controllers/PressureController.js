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
      res.render("../views/sensors", {result: splitTeam(pressure)});
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
      res.render("../views/sensors", {result: splitTeam(pressure)});
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

function splitTeam(teamArray) {
  var allTable = [];
  var lastTeam = 0;
  teamArray.sort((a, b) => a.teamID - b.teamID);
  for(var i=0;i<teamArray.length;i++) {
    if(teamArray[i].teamID != lastTeam) {
      
        allTable.push({
          sensor: teamArray[i].sensor,
          teamID: teamName[teamArray[i].teamID],
          keys: ['sensID','val','date'],
          data: [teamArray[i]]
       });
    } else {
        allTable[allTable.length-1].data.push(teamArray[i]);
    }
    lastTeam = teamArray[i].teamID;
  }
  return allTable;
}


module.exports = pressureController;
