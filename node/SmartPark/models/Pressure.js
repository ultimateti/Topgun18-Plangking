var mongoose = require('mongoose');

var PressureSchema = new mongoose.Schema({
  sensID: String,
  val: String,
  date: Date
});

module.exports = mongoose.model('Pressure', PressureSchema);
