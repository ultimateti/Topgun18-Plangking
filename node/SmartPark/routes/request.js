var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
var rp = require('request-promise');
var tempctrl = require('../controllers/TemperatureController')
var accelctrl = require('../controllers/AccelerometerController')
var din1ctrl = require('../controllers/Din1Controller')

router.get('/team/:teamID/:save', function(req, res, next) {
  var teamID = req.params.teamID;
  var isSave = req.params.save;
  var sensors = ['temperature', 'accelerometer','din1']
  var teamIDs = [];
  if(teamID=='All') 
    teamIDs = ['11', '12', '13', '14', '15', '16', '18', '19', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '37', '38', '40', '43', '44', '46', '47', '48', '49', '50', '52', '53', '54', '60', '61'];
    // teamIDs = [25, 45]
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
