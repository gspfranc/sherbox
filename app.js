var express = require('express'),
    app = express(),
    upload = require('./upload'),
    Schema = require('./schema'),
    Links = Schema.Links;
var shortId = require('shortid');

app.configure( function() {
  app.use(express.bodyParser());
  app.use(express.logger());
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

if(req.session.boxId){
console.log("Session is found");
	var key = req.body.key
	var link = Links.find({ key : key}, function (err, links){
		console.log("Files Found");
		 res.render('home', { boxID: req.session.boxId,files: links}); 
	});
	
} else {
	console.log("Box is not initiated, ID is created");
	//The boxID is not present
	//get new session ID
	req.session.boxId = (shortId.generate()).toUpperCase();
			 res.render('home', { boxID: req.session.boxId}); 

	}
});

app.listen(3000);
console.log("Listening on port 3000")
