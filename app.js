var express = require('express');
var app = express();

app.configure( function() {
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'lf9023endkvj' }));
  app.use(express.static(__dirname + '/public'));
});

app.get('/upload', function(req, res){
  res.json({ status: 'hello world' });
});

app.listen(3000);
console.log("Listening on port 3000")
