var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
  teamID: Number,
  description: String,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Alert', AlertSchema);
