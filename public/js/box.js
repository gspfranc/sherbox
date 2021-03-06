var password;

function startCountdown(createdOn){
  // 2 hours
  var expiration_time = new Date(createdOn);
  expiration_time = new Date(expiration_time.getTime() + (2 * 60 * 60 * 1000));
  var hours, minutes, seconds;
  var countdown = document.getElementById('countdown');
  var timer = setInterval(function() {
    var current_time = new Date();
    var seconds_left = (expiration_time - current_time) / 1000;
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);
    if (hours >= 1)
      countdown.style.color = "#FFFFFF"
    else if (minutes > 4 && minutes < 15)
      countdown.style.color = "#FFFF00"
    else if (minutes < 3)
      countdown.style.color = "#FF0000"
    countdown.innerHTML = hours + "h " + minutes + "m " + seconds + "s" 
     if (seconds_left == 0)
      clearInterval(timer);
  }, 1000);
};

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
        a.html('<span class="glyphicon glyphicon-file">&nbsp;</span><span>' + data.name + '</span>');
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

  msg = fl ? "Password" : "Create a password for this new box" ;

  if (!password) {
    while(!password)
      password = prompt(msg);  
    localStorage.setItem(box, password);
  }
  
  console.log(password);

  $('#files').on('change', handleFileSelect);

  $("#dropbox").on('dragenter', dragenter);
  $("#dropbox").on('dragover', dragover);
  $("#dropbox").on('drop', drop);

  var boxref = window.location.origin + '/box/' + window.box;
  $("#box").val(boxref);
  $("#twitterurl").attr('href', 'http://twitter.com/intent/tweet?text=Want to share some files with me? Go check my SherBox at ' + encodeURIComponent(boxref));



  startCountdown(window.createdOn);
  setTimeout(function() {
    $('#title h2').slideUp();
  }, 4000);

});
