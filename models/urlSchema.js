const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  id: String,
  url: String,
  keyWord: String,
});

module.exports = mongoose.model('Url', urlSchema);
