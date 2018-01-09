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
        title: 'Team ' + teamID,
        result: allTable
    });

  }).catch(err => console.log("ERR: " +err));



});

router.get('/team/:teamID', function(req, res, next) {
  var teamID = req.params.teamID;
  /*
  var sensors = ['temperature','accelerometer','din1'];
  var sensor = 'temperature';
  var tableData = [{},{},{},{},{},{},{},{},{}];

  var myRequests = [];
  myRequests.push(rp("http://10.0.0.10/api/temperature/" + teamID + "/1"));
  myRequests.push(rp("http://10.0.0.10/api/accelerometer/" + teamID + "/1"));
  myRequests.push(rp("http://10.0.0.10/api/din1/"+teamID+"/1"));

  var result = Promise.all(myRequests).then((results) => {
  var temparature = results[0]? JSON.parse(results[0]).data: null;
  var accelerometer = results[1]? JSON.parse(results[1]).data: null;
  var din1 = results[2]? JSON.parse(results[2]).data: null;

  }).catch(console.log("Error"));

  */

  var result = [
    {
        sensor: 'temperature',
        teamID: 5,
        keys: ['sensID','val','date'],
        data: [
        {
          "sensID" :1,
           "val" : 25.6 ,
           "date" : "2018-01-08T14:53:13.955+01:00" 
         }]
     },
    {
        sensor: 'accelerometer',
        teamID: 5,
        keys: ['sensID','val','date'],
        data: [
        {
          "sensID" :2,
           "val" : 25.6 ,
           "date" : "2018-01-08T14:53:13.955+01:00" 
         }]
     },
    {
        sensor: 'accelerometer',
        teamID: 5,
        keys: ['sensID','val','date'],
        data: [
        {
          "sensID" :3,
           "val" : 25.6 ,
           "date" : "2018-01-08T14:53:13.955+01:00" 
         }]
     }
  ];

    console.log("Result");
    console.log(result);
    res.render('request', {
        title: 'Team ' + teamID,
        result: result
    });

});



module.exports = router;
