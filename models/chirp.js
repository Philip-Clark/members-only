const moment = require('moment/moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const he = require('he');

const ChirpSchema = new Schema({
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

//virtual for relative timestamp
ChirpSchema.virtual('timestamp_relative').get(function () {
  return moment(this.timestamp).fromNow();
});

ChirpSchema.virtual('decodedMessage').get(function () {
  return he.decode(this.message);
});

//Export model
module.exports = mongoose.model('Chirp', ChirpSchema);
