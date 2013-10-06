function countdown(){
  var timeLimit = 60 * 1000; // in sec
  var expiration_time = new Date().getTime() + timeLimit;
  var hours, minutes, seconds;
  var countdown = document.getElementById('countdown');
  var timer = setInterval(function() {
   
    var current_time = new Date().getTime();
    var seconds_left = (expiration_time - current_time) / 1000
    hours = parseInt(seconds_left / 3600);
    seconds_left = parseInt(seconds_left % 3600);
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);
    countdown.innerHtml = hours + "h, " + minutes + "m, " + seconds + "s";
    console.log(hours + "h, " + minutes + "m, " + seconds + "s");
    if (seconds_left == 0)
      clearInterval(timer);
  }, 1000);
};