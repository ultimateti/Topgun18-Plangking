var mongoose = require("mongoose");
var Alert = require("../models/Alert");

var alertController = {};

alertController.list = function(req, res) {
  Alert.find({}).exec(function (err, alert) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      console.log(alert.length)
      res.render('alert', {result: alert})
    }
  });
};

alertController.save = function(req, res) {
  var alert = new Alert(req.body);
  alert.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('OK Naka alert')
      res.send('OK Naka')
    }
  });
};

module.exports = alertController;
