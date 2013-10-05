var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var linkSchema = new Schema({
  name: String
});


exports.Links = mongoose.model('Links', linkSchema);
