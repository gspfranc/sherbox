var password;

function handleFiles(files) {
  for (var i = 0, f; f = files[i]; i++) {
    var file = files[i];
    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onloadend = function(evt) {
      var dropbox = $("#dropbox h2");
      dropbox.html("Encrypting...");
      var crypt = sjcl.encrypt(password, reader.result);

      dropbox.html("Sending...");
      $.post("/put", { 
        crypt: crypt, 
        name: file.name,
        box: window.box
      }, function(data) {
        dropbox.html("Done!");
        var div = $('<div id="data-' + data.shortId + '">');
        div.html(data.crypt);
        $("#data").append(div);

        var a = $('<a href="#" class="file well">');
        a.html(data.name);
        a.attr('id', data.shortId);

        var li = $("<li>");
        li.append(a);

        $("#list").append(li);
        dropbox.html("Drag and drop files here");
      }, "json");
    }
  }
}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.target.files; // FileList object
  handleFiles(files);
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.originalEvent.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

$(document).on('click', '.file', function(e) {
  var id = $(e.target).attr('id');
  var name = $(e.target).html();
  var content = $('#data-' + id).html();
  var decrypt = sjcl.decrypt(password, content);
  window.location = 'data:Application/octet-stream,' + encodeURIComponent(decrypt);
});

$(document).ready(function(){
  password = localStorage.getItem(box);

  var fl = $('#list li').length;

  msg = fl ? "Password" : "Create a password" ;

  if (!password) {
    password = prompt(msg);  
    localStorage.setItem(box, password);
  }

  $('#files').on('change', handleFileSelect);

  $("#dropbox").on('dragenter', dragenter);
  $("#dropbox").on('dragover', dragover);
  $("#dropbox").on('drop', drop);

  var boxref = window.location.origin + '/box/' + window.box;
  $("#box").html(boxref);
  $("#box").attr('href', boxref);
});
