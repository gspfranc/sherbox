var express = require('express'),
    fs = require('fs'),
    util = require('util'),
    uuid = require('node-uuid'),
    app = express();


// Mainfunction to recieve and process the file upload data asynchronously
exports.uploadFile = function(req, targetdir, callback) {
  // Moves the uploaded file from temp directory to it's destination
  // and calls the callback with the JSON-data that could be returned.
  var moveToDestination = function(sourcefile, targetfile) {
    moveFile(sourcefile, targetfile, function(err) {
      if(!err)
        callback({success: true, file: targetfile});
      else
        callback({success: false, error: err});
    });
  };

  // Direct async xhr stream data upload, yeah baby.
  if(req.xhr) {
    var fname = req.header('x-file-name');

    // Be sure you can write to '/tmp/'
    var tmpfile = '/tmp/'+uuid.v1();

    // Open a temporary writestream
    var ws = fs.createWriteStream(tmpfile);
    ws.on('error', function(err) {
      console.log("uploadFile() - req.xhr - could not open writestream.");
      callback({success: false, error: "Sorry, could not open writestream."});
    });
    ws.on('close', function(err) {
      moveToDestination(tmpfile, targetdir+fname);
    });

    // Writing filedata into writestream
    req.on('data', function(data) {
      ws.write(data);
    });
    req.on('end', function() {
      ws.end();
    });
  }

  // Old form-based upload
  else {
    moveToDestination(req.files.file.path, targetdir+req.files.file.name);
  }
};

// Moves a file asynchronously over partition borders
var moveFile = function(source, dest, callback) {
  var is = fs.createReadStream(source)

  is.on('error', function(err) {
    console.log('moveFile() - Could not open readstream.');
    callback('Sorry, could not open readstream.')
  });

  is.on('open', function() {
    var os = fs.createWriteStream(dest);

    os.on('error', function(err) {
      console.log('moveFile() - Could not open writestream.');
      callback('Sorry, could not open writestream.');
    });

    os.on('open', function() {

      is.pipe(os, function() {
        fs.unlinkSync(source);
      });

      callback();
    });
  });
};
