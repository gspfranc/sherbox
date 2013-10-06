var express = require('express'),
app = express(),
upload = require('./upload'),
Schema = require('./schema'),
SMS = require('./notification'),
Links = Schema.Links;
var shortId = require('shortid');




app.configure( function() {
  app.use(express.bodyParser());
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.session({ secret: 'lf9023endkvj' }));
  app.use(express.static(__dirname + '/public'));
});

app.post('/put', function(req, res){
  console.log(req.body.crypt);
  Links.create({ 
  	shortId: shortId.generate(),
    name: req.body.name, 
    crypt: req.body.crypt, 
    box: req.body.box
  }, function(err, file) {
    if (err) console.log(err);
    res.json(file);
  });
}); 

app.get('/', function(req, res) {

  var box = req.session.box || shortId.generate();
  SMS.notify("17736911350",box);
  res.redirect('/box/' + box);
});

app.get('/box/:box', function(req, res){
  var box = req.params.box;
  Links.find({ box: box }, function (err, files) {
    res.render('home', { box: box, files: files }); 
  });
});

app.listen(3000);
console.log("Listening on port 3000")
