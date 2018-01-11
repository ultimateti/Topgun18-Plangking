var mongoose = require('mongoose');

var AccelerometerSchema = new mongoose.Schema({
  sensID: String,
  val_x: String,
  val_y: String,
  val_z: String,
  date: Date
});

module.exports = mongoose.model('Accelerometer', AccelerometerSchema);