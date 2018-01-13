var mongoose = require("mongoose");
var Temperature = require("../models/Schema").Temperature;
var teamName = require("../models/TeamName");
var temperatureController = {};

temperatureController.list = function(req, res) {
  Temperature.find({}).exec(function(err, temperature) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.render("../views/sensors", {
        result: splitTeam(temperature),
        title: "Temperature"
      });
    }
  });
};

temperatureController.filterRange = function(start_time, end_time, callback) {
  Temperature.find({
    date: {
      $gte: start_time,
      $lte: end_time
    }
  }).exec(function(err, temperature) {
    if (err) {
      console.log("Error:", err);
    } else {
      callback(temperature);
    }
  });
};

temperatureController.save = function(req, team) {
  var tempObj = { teamID: team };
  Temperature.count(
    {
      teamID: team
    },
    function(err, count) {
      if (count <= req.length) {
        for (var i = count; i < req.length; i++) {
          var temperature = new Temperature(extend(tempObj, req[i]));
          temperature.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    }
  );
};

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function(source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}

function splitTeam(teamArray) {
  var allTable = [];
  var lastTeam = 0;
  teamArray.sort((a, b) => a.teamID - b.teamID);
  for (var i = 0; i < teamArray.length; i++) {
    if (teamArray[i].teamID != lastTeam) {
      allTable.push({
        sensor: "temperature",
        teamName: teamName[teamArray[i].teamID],
        teamID: teamArray[i].teamID,
        keys: ["sensID", "val", "date"],
        data: [teamArray[i]]
      });
    } else {
      allTable[allTable.length - 1].data.push(teamArray[i]);
    }
    lastTeam = teamArray[i].teamID;
  }
  return allTable;
}

module.exports = temperatureController;
