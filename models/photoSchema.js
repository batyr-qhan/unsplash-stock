const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  id: String,
  photoURL: String,
  author: String,
});

module.exports = mongoose.model('Photo', photoSchema);
