var express = require('express'),
    app = express(),
    upload = require('./upload'),
    Schema = require('./schema'),
    Links = Schema.Links;

app.configure( function() {
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'lf9023endkvj' }));
  app.use(express.static(__dirname + '/public'));
});

app.get('/upload', function(req, res){
  var files = JSON.parse(req.query.files);

  files.forEach(function(file){
    console.log(file);
  });
}); 

app.listen(3000);
console.log("Listening on port 3000")
