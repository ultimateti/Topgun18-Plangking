var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');

router.post('/postCoordinate', function(req, res, next) {
    var data = {
        TEAM_ID: req.body.TEAM_ID,
        LAT: req.body.LAT,
        LONG: req.body.LONG
    }
    console.log(data);
    res.render('showpost', {data: data})
})

router.get('/team/:teamID', function(req, res, next) {
  var teamID = req.params.teamID;
  var sensors = ['temperature','accelerometer','din1'];
  var sensor = 'temperature';
  var tableData = [{},{},{},{},{},{},{},{},{}];
  request('http://10.0.0.10/api/'+sensor+'/'+teamID+'/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[0].keys = keys;
          tableData[0].type = sensor;
          tableData[0].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[0].keys = keys;
          tableData[0].type = 'error';
          tableData[0].data = [data];
        }



          sensor = 'accelerometer';
  request('http://10.0.0.10/api/'+sensor+'/'+teamID+'/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[1].keys = keys;
          tableData[1].type = sensor;
          tableData[1].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[1].keys = keys;
          tableData[1].type = 'error';
          tableData[1].data = [data];
        }


        
  sensor = 'din1';
  request('http://10.0.0.10/api/'+sensor+'/'+teamID+'/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[2].keys = keys;
          tableData[2].type = sensor;
          tableData[2].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[2].keys = keys;
          tableData[2].type = 'error';
          tableData[2].data = [data];
        }


        res.render('request', {
          showAll: false,
          temperatureData5: tableData[0],
          accelerometerData5: tableData[1],
          din1Data5: tableData[2],
          temperatureData7: tableData[3],
          accelerometerData7: tableData[4],
          din1Data7: tableData[5],
          temperatureData9: tableData[6],
          accelerometerData9: tableData[7],
          din1Data9: tableData[8]
        });
        
    });

    });


    });


router.get('/team/All', function(req, res, next) {
  var sensors = ['temperature','accelerometer','din1'];
  var sensor = 'temperature';
  var tableData = [{},{},{},{},{},{},{},{},{}];
  request('http://10.0.0.10/api/'+sensor+'/5/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[0].keys = keys;
          tableData[0].type = sensor;
          tableData[0].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[0].keys = keys;
          tableData[0].type = 'error';
          tableData[0].data = [data];
        }



          sensor = 'accelerometer';
  request('http://10.0.0.10/api/'+sensor+'/5/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[1].keys = keys;
          tableData[1].type = sensor;
          tableData[1].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[1].keys = keys;
          tableData[1].type = 'error';
          tableData[1].data = [data];
        }


        
  sensor = 'din1';
  request('http://10.0.0.10/api/'+sensor+'/5/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[2].keys = keys;
          tableData[2].type = sensor;
          tableData[2].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[2].keys = keys;
          tableData[2].type = 'error';
          tableData[2].data = [data];
        }

        sensor = 'temperature';
        request('http://10.0.0.10/api/'+sensor+'/7/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[3].keys = keys;
          tableData[3].type = sensor;
          tableData[3].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[3].keys = keys;
          tableData[3].type = 'error';
          tableData[3].data = [data];
        }



          sensor = 'accelerometer';
  request('http://10.0.0.10/api/'+sensor+'/7/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[4].keys = keys;
          tableData[4].type = sensor;
          tableData[4].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[4].keys = keys;
          tableData[4].type = 'error';
          tableData[4].data = [data];
        }


        
  sensor = 'din1';
  request('http://10.0.0.10/api/'+sensor+'/7/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[5].keys = keys;
          tableData[5].type = sensor;
          tableData[5].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[5].keys = keys;
          tableData[5].type = 'error';
          tableData[5].data = [data];
        }

        sensor = 'temperature';
        request('http://10.0.0.10/api/'+sensor+'/9/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[6].keys = keys;
          tableData[6].type = sensor;
          tableData[6].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[6].keys = keys;
          tableData[6].type = 'error';
          tableData[6].data = [data];
        }



          sensor = 'accelerometer';
  request('http://10.0.0.10/api/'+sensor+'/9/All', function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[7].keys = keys;
          tableData[7].type = sensor;
          tableData[7].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[7].keys = keys;
          tableData[7].type = 'error';
          tableData[7].data = [data];
        }


        
  sensor = 'din1';
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          tableData[8].keys = keys;
          tableData[8].type = sensor;
          tableData[8].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          tableData[8].keys = keys;
          tableData[8].type = 'error';
          tableData[8].data = [data];
        }

        

        res.render('request', {
          showAll: true,
          temperatureData5: tableData[0],
          accelerometerData5: tableData[1],
          din1Data5: tableData[2],
          temperatureData7: tableData[3],
          accelerometerData7: tableData[4],
          din1Data7: tableData[5],
          temperatureData9: tableData[6],
          accelerometerData9: tableData[7],
          din1Data9: tableData[8]
        });
        
    });

    });


    });

        
        
    });

    });


    });

       
        
    });

    });


    });




});



/*
router.get('/teamsensor/:sensor/:teamID', function(req, res, next) {
  var sensor = req.params.sensor;
  var teamID = req.params.teamID;

  console.log(sensor);
  console.log(teamID);

  request('http://10.0.0.10/api/'+sensor+'/'+teamID, function(error, response, body) {
      console.log('x'+body);
      var data = JSON.parse(body);
      
      if(data.statusCode=='00') {
        var keys = [];
        if(sensor=='temperature') {
          keys = ['sensID','val','date'];
        } else if(sensor=='accelerometer') {
          keys = ['sensID','val_x','val_y','val_z','date'];
        } else if(sensor.startsWith('din')) {
          keys = ['sensID','val','date'];
        }
        res.render('request', {
          type: sensor,
          heads: keys,
          data: data.data
        });
      } else {
        res.render('request', {
          type: 'error',
          heads: ['statusCode','statusDesc'],
          data: data
        });
      }
      
  });
});


router.get('/team/:teamID', function(req, res, next) {
  var teamID = req.params.teamID;
  var sensors = ['temperature','accelerometer','din1'];
  var table = [{},{},{}];

  for(var i=0;i<sensors.length;i++) {
    var sensor = sensors[i];
     console.log('http://10.0.0.10/api/'+sensor+'/'+teamID);
    request('http://10.0.0.10/api/'+sensor+'/'+teamID, function(error, response, body) {
        var data = JSON.parse(body);
        
        if(data.statusCode=='00') {
          var keys = [];
          if(sensor=='temperature') {
            keys = ['sensID','val','date'];
          } else if(sensor=='accelerometer') {
            keys = ['sensID','val_x','val_y','val_z','date'];
          } else if(sensor.startsWith('din')) {
            keys = ['sensID','val','date'];
          }
          table[i].keys = keys;
          table[i].type = sensor;
          table[i].data = data.data;
        } else {
          keys =  ['statusCode','statusDesc'];
          table[i].keys = keys;
          table[i].type = 'error';
          table[i].data = data;
        }
        console.log(table[i]);
        res.render('request', {
          table: table
        });
        

    });
  }
    
});

router.get('/test', function(req, res, next) {
  var teamID = req.params.teamID;
  var sensors = ['temperature','accelerometer','din1'];
  var table = [{},{},{}];

  for(var i=0;i<sensors.length;i++) {
    table[i].keys = ['a','b','c'];
    table[i].type = 'hi there';
    table[i].data = [{'a':20,'b':30,'c':40},{'a':600,'b':380,'c':4040}];
    console.log(table[i]);
    res.render('request', {
      table: table
    });
        
  }
    
});

router.get('/getTeam/:teamID/', function(req, res, next){
  console.log("get function");
  get_data(4);
});

function get_data(teamID){
    var agent = new https.Agent({
        host: 'loraiot.cattelecom.com',
        port: '443',
        path: '/',
        rejectUnauthorized: false
    });
    var options = ({
        method: 'GET',
        agent: agent,
        header: { 'Content-Type': 'application/json'}
    });

    options.url = 'https://loraiot.cattelecom.com/api/pressure/'+teamID+'/1'
    request(options, function(err, res, body){
        if (err) throw err;
        var data = JSON.parse(body);
        console.log(data);
    });
  }

  */
module.exports = router;
