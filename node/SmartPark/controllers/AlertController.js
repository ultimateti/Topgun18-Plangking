var mongoose = require("mongoose");
var Alert = require("../models/Schema").Alert;

var alertController = {};

alertController.list = function(req, res) {
  Alert.find({}).exec(function(err, alert) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.render("alert", {
        result: alert,
        title: "Alert"
      });
    }
  });
};

alertController.save = function(req, res) {
  var alert = new Alert(req.body);
  alert.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send({
        statusCode: "200",
        description: "OK"
      });
    }
  });
};

module.exports = alertController;
