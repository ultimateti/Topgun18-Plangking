var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
var rp = require('request-promise');
var tempctrl = require('../controllers/TemperatureController')
var accelctrl = require('../controllers/AccelerometerController')
var din1ctrl = require('../controllers/Din1Controller')

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

router.get('/allTeamSensor/:start_time/:end_time', function(req, res, next) {
  var startHr = req.params.start_time.slice(0, 2)
  var startMin = req.params.start_time.slice(2, 4)
  var endHr = req.params.end_time.slice(0, 2)
  var endMin = req.params.end_time.slice(2, 4)

  var start_dt = '2018-01-11 ' + startHr + ':' + startMin + ':00';
  var end_dt = '2018-01-11 ' + endHr + ':' + endMin + ':00';

  var result = {}

  accelctrl.filterRange(start_dt, end_dt, function(acc_res) {
    result['accelerometer'] = acc_res
    tempctrl.filterRange(start_dt, end_dt, function(tmp_res) {
      result['temperature'] = tmp_res
      din1ctrl.filterRange(start_dt, end_dt, function(din_res) {
        result['din1'] = din_res
        res.send(result)
      })
    })
  })
})

router.get('/hello', function(req, res, next) {
  res.send('hello')
})

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
  var sensors = ['temperature', 'accelerometer','din1']
  var teamIDs = [];
  if(teamID=='All') 
    // teamIDs = ['11', '12', '13', '14', '15', '16', '18', '19', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '37', '38', '40', '43', '44', '46', '47', '48', '49', '50', '52', '53', '54', '60', '61'];
    teamIDs = [25, 45]
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
      var isensor = sensors[i % sensors.length];
      var iteamID = teamIDs[Math.floor(i / 3)];
     
      console.log('lul' + isensor)
      if(resj.statusCode=='00') {
        console.log("uiui" + iteamID + 'ii ' + isSave)
        
        if (isSave == 'true') {
          switch(isensor){
            case 'temperature': tempctrl.save(resj.data, iteamID); break;
            case 'accelerometer': accelctrl.save(resj.data, iteamID); break;
            case 'pressure': pressctrl.save(resj.data); break;
            case 'humidity': humidctrl.save(resj.data); break;
            case 'gyroscope': gyroctrl.save(resj.data); break;
            case 'magnetometer': magnetctrl.save(resj.data); break;
            case 'din1': din1ctrl.save(resj.data, iteamID); break;
          }
        }
        
      }
    
    }
    console.log(allTable.length);
    res.render('index', { title: 'GET all sensors complete!', desc:''})

  }).catch(function(err) {
    console.log(err)
    res.render('index', { title: 'GET all error!', desc: err })
  });
  
});

module.exports = router;
