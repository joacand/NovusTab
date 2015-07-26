var d = new Date();
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var day = days[ d.getDay() ];
var month = months[ d.getMonth() ];
var dateOut = day.concat(", ").concat(month).concat(" ").concat(d.getDate());
var APIKEY = "YourKeyHere"; // Hide in PHP later

// Default long/lat coordinates are used if user denies geolocation or if geolocation
// is not available
var longitude = 38.8833;
var latitude = 77.0167;

document.getElementById("date").innerHTML = dateOut;
    
myTimer();
setInterval(function () {myTimer()}, 1000);
showWeather();

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

function showWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
  } else {
    locationError();
  }
}

function locationSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude; 
  
  // Start with location fetched from user
  weather(latitude, longitude);
}

function locationError(err) {
  // Start with default location
  weather(latitude, longitude);
}

function weather(wLatitude, wLongitude) {
  var icons = ['clear-day','clear-night','rain','snow','sleet','wind','fog','cloudy','partly-cloudy-day','partly-cloudy-night'];
  // Format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE,TIME

  var apiURL = "https://api.forecast.io/forecast/" + APIKEY + 
               "/" + wLatitude + "," + wLongitude;
  
  $.getJSON(apiURL + "?callback=?", function(data) {
    var temp = (data.currently.temperature - 32) * (5/9);
    var icon = data.currently.icon;
    if (icons.indexOf(icon) == -1) {
      icon = "clear-day.png";
    }
    var img = "<img src=\"img/"+ icon +".png\" style=\"width:100px;height:auto\";>";
    temp = temp.toFixed(0) + " &#176;C";
    document.getElementById("weather").innerHTML = img + "<br>" 
    + "<b>" + temp + "</b>" + "<br>"
    + "Now";
  });

}