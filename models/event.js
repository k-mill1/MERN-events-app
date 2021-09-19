const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  name: String,
  location: String,
  information: String,
  date: String
})

module.exports.Event = mongoose.model('Event', eventSchema)