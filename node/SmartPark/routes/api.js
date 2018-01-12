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

router.get('/streamdata', function(req, res, next) {
  var sensors = ['temperature', 'accelerometer','din1']
  var requests = []
  var result = {}
  for (var i = 0; i < sensors.length; i++) {
    requests.push(rp("http://10.0.0.10/api/" + sensors[i] + "/25/All"))
    console.log("http://10.0.0.10/api/" + sensors[i] + "/25/All")
  }

  Promise.all(requests).then((results) => {
    for(var i = 0; i < results.length; i++) {
      var resj = JSON.parse(results[i]);
      var isensor = sensors[i % sensors.length];
     
      if(resj.statusCode=='00') {
        switch(isensor){
          case 'temperature': tempctrl.save(resj.data, '25'); break;
          case 'accelerometer': accelctrl.save(resj.data, '25'); break;
          case 'din1': din1ctrl.save(resj.data, '25'); break;
        }
      }
    }
    return true
  }).then(function(ret) {
    var start_dt = '2018-01-11T17:00:00Z' 
    var end_dt = new Date().toISOString()
    console.log(new Date().toISOString())
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
  }).catch(function(err) {
    console.log(err)
    res.send({data: 'error'})
  });
})

router.get('/hello', function(req, res, next) {
  res.send('hello')
})

module.exports = router;
