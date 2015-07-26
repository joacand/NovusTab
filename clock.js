var d = new Date();
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var day = days[ d.getDay() ];
var month = months[ d.getMonth() ];
var dateOut = day.concat(", ").concat(month).concat(" ").concat(d.getDate());
document.getElementById("date").innerHTML = dateOut;
    
myTimer();
setInterval(function () {myTimer()}, 1000);

function myTimer() {
  var d = new Date();
  var timeDate = d.toTimeString().split(' ')[0];
  var timeDateSite = timeDate.replace(":"," ").replace(":"," ");
      
  document.getElementById("clock").innerHTML = timeDateSite;
  document.title = timeDate;
  var time = d.getTime().toString();
  var lastSix = time.substr(time.length - 6);
  var color = "#".concat(lastSix);
  document.body.style.backgroundColor = color;
}