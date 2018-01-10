var mongoose = require('mongoose');

var TemperatureSchema = new mongoose.Schema({
  sensID: String,
  val: String,
  date: String
});

module.exports = mongoose.model('Temperature', TemperatureSchema);
