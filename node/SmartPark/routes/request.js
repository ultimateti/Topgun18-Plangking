var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
var rp = require('request-promise');
var tempctrl = require('../controllers/TemperatureController')
var pressctrl = require('../controllers/PressureController')
var humidctrl = require('../controllers/HumidityController')
var accelctrl = require('../controllers/AccelerometerController')
var gyroctrl = require('../controllers/GyroscopeController')
var magnetctrl = require('../controllers/MagnetometerController')

var keyMapping = {
    'pressure':['sensID','val','date'],
    'temperature':['sensID','val','date'],
    'humidity':['sensID','val','date'],
    'gyroscope':['sensID','val_x','val_y','val_z','date'],
    'accelerometer':['sensID','val_x','val_y','val_z','date'],
    'magnetometer':['sensID','val_x','val_y','val_z','date'],
    'leds':['sensID','val','date'],
    'din':['sensID','val','date']
};

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

router.get('/team/:teamID/:save', function(req, res, next) {
  var teamID = req.params.teamID;
  var isSave = req.params.save;
  var sensors = ['temperature', 'accelerometer', 'pressure', 'humidity', 'gyroscope', 'magnetometer']
  var teamIDs = [];
  if(teamID=='All') 
    teamIDs = [5,7,9];
  else
    teamIDs = [teamID];

  var myRequests = [];
  for(var i = 0; i < teamIDs.length; i++) {
    for(var j = 0; j < sensors.length; j++) {
      myRequests.push(rp("http://10.0.0.10/api/" + sensors[j] + "/" + teamIDs[i] + "/All"));
      console.log("http://10.0.0.10/api/" + sensors[j] + "/" + teamIDs[i] + "/All");
    }
  }

  var allTable = [];
  Promise.all(myRequests).then((results) => {
    for(var i = 0; i < results.length; i++) {
      var resj = JSON.parse(results[i]);
      var newTable;
      var isensor = sensors[i%sensors.length];
      var iteamID = teamIDs[Math.floor(i/teamIDs.length)];
      if(resj.statusCode=='00') {
        newTable = {
          sensor: isensor,
          teamID: 'แปลงขิง the Origin',
          keys: (keyMapping.hasOwnProperty(isensor))? keyMapping[isensor]:['sensID','val','date'],
          data: resj.data
        };
        
        if (isSave == 'true') {
          switch(sensors[i]){
            case 'temperature': tempctrl.save(resj.data); break;
            case 'accelerometer': accelctrl.save(resj.data); break;
            case 'pressure': pressctrl.save(resj.data); break;
            case 'humidity': humidctrl.save(resj.data); break;
            case 'gyroscope': gyroctrl.save(resj.data); break;
            case 'magnetometer': magnetctrl.save(resj.data); break;
          }
        }
        
      } else {
        newTable = {
          sensor: isensor,
          teamID: 'แปลงขิง the Origin',
          keys: ['statusCode','statusDesc'],
          data: resj
       };
      }
      
     allTable.push(newTable);
    }
    console.log(allTable.length);
    res.render('index', { title: 'GET all sensors complete!', desc:''})

  }).catch(function(err) {
    console.log(err)
    res.render('index', { title: 'GET all error!', desc: err })
  });
  
});

module.exports = router;
