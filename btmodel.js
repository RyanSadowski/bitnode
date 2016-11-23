var mongoose = require('mongoose');
var bitNodeSchema = new mongoose.Schema({
  updated_at: { type: Date, default: Date.now },
  pubAddress: String,
  privateWif: String
})
module.exports = mongoose.model('bitNode', bitNodeSchema);
