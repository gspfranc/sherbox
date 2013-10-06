var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var linkSchema = new Schema({
  name: String,
  box: String,
  crypt: String,
  shortId: String
});

var boxSchema = new Schema({
  box: String,
  phoneNumber:String,
  createdOn: Date
});

exports.Links = mongoose.model('Links', linkSchema);
exports.Boxes = mongoose.model('Boxes', boxSchema);

mongoose.connect('mongodb://127.0.0.1:27017/sherbox');
