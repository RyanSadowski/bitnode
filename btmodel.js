var mongoose = require('mongoose');
var bitNodeSchema = new mongoose.Schema({
  updated_at: { type: Date, default: Date.now },
  pubAddress: String,
  privateWif: String,
  verified:
    {
        type: String,
        default: 'false'
    }
})
module.exports = mongoose.model('btmodel', bitNodeSchema);
