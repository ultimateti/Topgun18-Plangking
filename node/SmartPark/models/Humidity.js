var mongoose = require('mongoose');

var HumiditySchema = new mongoose.Schema({
  sensID: String,
  val: String,
  date: Date
});

module.exports = mongoose.model('Humidity', HumiditySchema);
