// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost/bitnode');
// Create a schema

var walletSchema = new mongoose.Schema({
  updated_at: { type: Date, default: Date.now },
  address: String,
  encryptedKey: String

})
