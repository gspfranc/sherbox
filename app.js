var express = require('express'),
  app = express(),
  upload = require('./upload'),
  Schema = require('./schema'),
  SMS = require('./notification'),
  Links = Schema.Links,
  Boxes = Schema.Boxes,
  shortId = require('shortid');

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
  Links.create({ 
    shortId: shortId.generate(),
    name: req.body.name, 
    crypt: req.body.crypt, 
    box: req.body.box
  }, function(err, file) {
    if (err) console.log(err);

    Boxes.findOne({ box: req.body.box }, function (err, mybox) {
      mybox.mobiles.forEach(function() {
        SMS.notify(phone, mybox.box);
      });
    });

    res.json(file);
  });
}); 

app.get('/', function(req, res) {
  var box = req.session.box || shortId.generate();

  //Box creation
  Boxes.create({
    box: box,
    createdOn: new Date()
  }, function() {});

  res.redirect('/box/' + box);
});

app.get('/box/:box', function(req, res){
  var box = req.params.box;
  Links.find({ box: box }, function (err, files) {
    Boxes.findOne({ box: box }, function(err, mybox) {
      res.render('home', { files: files, box: mybox }); 
    })
  });
});

app.post('/phone/add', function(req, res) {
  Boxes.findOne({ box: req.body.box }, function(err, box) {
    box.mobiles.push(req.body.mobile);
    box.save(function() {});
  });  
});

app.post('/phone/remove', function(req, res) {
  Boxes.findOne({ box: req.body.box }, function(err, box) {
    var index = box.mobiles.indexOf(req.body.mobile);
    if (index > -1)
      box.mobiles.splice(index, 1);
    box.save(function() {});
  });  
});

var cleanBoxes = function() {
  console.log("cleaning boxes");
  var date = new Date();
  date.setTime(date.getTime() - 7200000);
  var query = { createdOn: { $lte: date }};
  Boxes.remove(query, function(err, boxes){}); 
  setTimeout(function(){ cleanBoxes() }, 60000);
};

cleanBoxes();

app.listen(3000);
console.log("Listening on port 3000")
