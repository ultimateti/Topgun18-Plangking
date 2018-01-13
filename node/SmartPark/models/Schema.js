var mongoose = require("mongoose");

var AccelerometerSchema = new mongoose.Schema({
  teamID: String,
  sensID: String,
  val_x: String,
  val_y: String,
  val_z: String,
  date: Date
});

var Accelerometer = mongoose.model("Accelerometer", AccelerometerSchema);

var AlertSchema = new mongoose.Schema({
  teamID: Number,
  description: String,
  date: { type: Date, default: Date.now }
});

var Alert = mongoose.model("Alert", AlertSchema);

var Din1Schema = new mongoose.Schema({
  teamID: String,
  sensID: String,
  val: String,
  date: Date
});

var Din1 = mongoose.model("Din1", Din1Schema);

var TemperatureSchema = new mongoose.Schema({
  teamID: String,
  sensID: String,
  val: String,
  date: Date
});

var Temperature = mongoose.model("Temperature", TemperatureSchema);

module.exports = {
  Accelerometer: Accelerometer,
  Alert: Alert,
  Din1: Din1,
  Temperature: Temperature
};
