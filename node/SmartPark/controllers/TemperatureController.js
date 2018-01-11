var mongoose = require("mongoose");
var Temperature = require("../models/Temperature");

var temperatureController = {};

// Show list of employees
temperatureController.list = function(req, res) {
  Temperature.find({}).limit(200).exec(function (err, temperature) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      var allTable = [];
      var lastTeam = 0;
      temperature.sort((a, b) => parseInt(a.teamID) > parseInt(b.teamID));
      for(var i=0;i<temperature.length;i++) {
        if(temperature[i].teamID != lastTeam) {
          console.log(temperature[i].teamID + ' x ' + lastTeam);
            allTable.push({
              sensor: 'temperature',
              teamID: 'แปลงขิง the Origin',
              keys: ['sensID','val','date'],
              data: [temperature[i]]
           });
        } else {
            console.log(temperature[i].teamID + ' / ' + lastTeam);
            allTable[allTable.length-1].data.push(temperature[i]);
        }
        lastTeam = temperature[i].teamID;
      }
      console.log(allTable.length);

      res.render("../views/sensors", {result: allTable, gotten: false});
    }
  });
};

temperatureController.filter = function(req, res) {
  var times = req.daytime;
  var valtime = new Date(times).valueOf()
  var startTime = new Date(valtime - 30 * 60000)
  Temperature.find({date: {$gte: startTime, $lte: times}}).exec(function (err, temperature) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      var newTable = {
          sensor: 'temperature',
          teamID: 'แปลงขิง the Origin',
          keys: ['sensID','val','date'],
          data: temperature
       };

      res.render("../views/sensors", {result: [newTable], gotten: true});
    }
  });
};

// // Save new employee
temperatureController.save = function(req, team) {
  var tempObj = {teamID: team}
  Temperature.count({teamID: team}, function(err, count) {
    console.log('WUT temp ' + team + ' count ' + count)    
    if (count <= req.length) {
      for (var i = count; i < req.length; i++) {
        var temperature = new Temperature(extend(tempObj, req[i]));
        temperature.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            // console.log("Successfully created");
            Temperature.update({}, {teamID: team}, {multi: true}, function(err) {
              if (err)
              console.log('OK Naka ' + 'temp')
            })
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

module.exports = temperatureController;
