var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var linkSchema = new Schema({
  name: String,
  box: String,
  crypt: String
});


exports.Links = mongoose.model('Links', linkSchema);

mongoose.connect('mongodb://127.0.0.1:27017/sherbox');
