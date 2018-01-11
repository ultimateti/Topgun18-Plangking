var mongoose = require('mongoose')

var Din1Schema = new mongoose.Schema({
  teamID: String,
  sensID: String,
  val: String,
  date: Date
});

module.exports = mongoose.model('Din1', Din1Schema)