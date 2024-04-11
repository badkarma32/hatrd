const mongoose = require("mongoose");

const releasenotes = new mongoose.Schema({
  Updates: String,
  Date: String,
  Developer: String,
  Version: Number
});

module.exports = mongoose.model('notes', releasenotes);