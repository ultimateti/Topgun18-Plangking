var mongoose = require("mongoose");
var Din1 = require("../models/Din1");
var teamName = require('./TeamName');
var din1Controller = {};

din1Controller.list = function(req, res) {
  Din1.find({}).exec(function (err, din1) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/sensors", {result: splitTeam(din1),title: 'Din1'});
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
        res.json({result: splitTeam(din1)});
    }
  });
};

din1Controller.filterRange = function(start_time, end_time, callback) {
  Din1.find({date: {$gte: start_time, $lte: end_time}}).exec(function (err, din1) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      callback(din1)
    }
  });
}

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

function splitTeam(teamArray) {
  var allTable = [];
  var lastTeam = 0;
  teamArray.sort((a, b) => a.teamID - b.teamID);
  for(var i=0;i<teamArray.length;i++) {
    if(teamArray[i].teamID != lastTeam) {
        allTable.push({
          sensor: 'din1',
          teamName: teamName[teamArray[i].teamID],
          teamID: teamArray[i].teamID,
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

module.exports = din1Controller;
