var express = require('express'),
app = express(),
upload = require('./upload'),
Schema = require('./schema'),
SMS = require('./notification'),
Links = Schema.Links,
Boxes = Schema.Boxes;
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
  
  //Avertir par sms les correspondants
  Boxes.find({box:box}, function (err, box) {
    var phoneArray=box.phoneNumber.split(",");
    var phoneArray="17736911350,17736911350,17736911350,17736911350".split(",");
    for (phone in phoneArray){
      SMS.notify(phone,box.box);
    }  
  });


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
    
    //Box creation
    Boxes.create({
    box: box,
    createdOn: Date.getDate()
  }).exec();

  res.redirect('/box/' + box);
});

app.get('/box/:box', function(req, res){
  var box = req.params.box;
  Links.find({ box: box }, function (err, files) {
    var myBox = Boxes.find({ box: box })

    res.render('home', { box: box, files: files, createdOn: myBox.createdOn}); 
  });
});

app.listen(3000);
console.log("Listening on port 3000")
