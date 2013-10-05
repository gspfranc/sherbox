var express = require('express'),
    app = express(),
    upload = require('./upload');

app.configure( function() {
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'lf9023endkvj' }));
  app.use(express.static(__dirname + '/public'));
});

app.get('/upload', function(req, res){
 upload.uploadFile(req, __dirname + '/../uploads/', function(data) {
    if(data.success) {
      res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 200);
    }
    else
      res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 404);
  });
}); 

app.listen(3000);
console.log("Listening on port 3000")
