var express = require('express'),
app = express(),
upload = require('./upload'),
Schema = require('./schema'),
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

app.get('/put', function(req, res){
  var crypt = req.body.crypt;
  var name = req.body.name;
  console.log("A crypt has been uploaded !" + crypt);
  Links.create({name: name, crypt: crypt});
  console.log(crypt + 'has been saved to the DB');
}); 

app.get('/', function(req, res) {
  var box = req.session.box || shortId.generate();
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
