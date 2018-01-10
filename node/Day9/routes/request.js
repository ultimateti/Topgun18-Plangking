var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
var rp = require('request-promise');

router.post('/postCoordinate', function(req, res, next) {
    var data = {
        TEAM_ID: req.body.TEAM_ID,
        LAT: req.body.LAT,
        LONG: req.body.LONG
    }
    console.log(data);
    res.render('showpost', {data: data})
});

router.get('/dummy/:teamID', function(req, res, next) {
  var teamID = req.params.teamID;
  var sensors = ['posts','albums'];
  
  var myRequests = [];
  for(var i=0;i<sensors.length;i++) {
    myRequests.push(rp("https://jsonplaceholder.typicode.com/" + sensors[i]));
  }

  var allTable = [];
  Promise.all(myRequests).then((results) => {
    for(var i=0;i<results.length;i++) {
      var newTable = {
        sensor: sensors[i],
        teamID: teamID,
        keys: ['userId','id','title'],
        data: JSON.parse(results[i])
     };
     allTable.push(newTable);
    }
    console.log(allTable.length);
    res.render('request', {
        result: allTable
    });

  }).catch(err => console.log("ERR: " +err));



});


router.get('/team/:teamID', function(req, res, next) {
  var teamID = req.params.teamID;
  var sensors = ['temperature','accelerometer','din1'];
  var teamIDs = [];
  if(teamID=='All') 
    teamIDs = [5,7,9];
  else
    teamIDs = [teamID];

  var myRequests = [];
  for(var i=0;i<teamID.length;i++) {
    for(var j=0;j<sensors.length;j++) {
      myRequests.push(rp("http://10.0.0.10/api/" + sensors[j] + "/" + teamIDs[i] + "/5"));
      console.log("http://10.0.0.10/api/" + sensors[j] + "/" + teamIDs[i] + "/5");
    }
  }

  var allTable = [];
  Promise.all(myRequests).then((results) => {
    for(var i=0;i<results.length;i++) {
      var resj = JSON.parse(results[i]);
      var newTable;
      var isensor = sensors[i%sensors.length];
      var iteamID = teamIDs[Math.floor(i/teamIDs.length)];
      if(resj.statusCode=='00') {
        newTable = {
          sensor: isensor,
          teamID: iteamID,
          keys: ['sensID','val','date'],
          data: resj.data
       };
      } else {
        newTable = {
          sensor: isensor,
          teamID: iteamID,
          keys: ['statusCode','statusDesc'],
          data: resj
       };
      }
      
     allTable.push(newTable);
    }
    console.log(allTable.length);
    res.render('request', {
        result: allTable
    });

  }).catch(err => console.log("ERR: " +err));
  
  
});



module.exports = router;
