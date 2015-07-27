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
  var d = new Date();
  var today = d.getDay(); // 0 = Sun
  
  // Format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE,TIME
  var apiURL = "https://api.forecast.io/forecast/" + APIKEY + 
               "/" + wLatitude + "," + wLongitude;
  
  $.getJSON(apiURL + "?callback=?", function(data) {
    var currTemp = ((data.currently.temperature - 32) * (5/9)).toFixed(0); // Convert from F to C
    var currIcon = data.currently.icon;
    var dataPoint = data.daily.data;

    addDay(currTemp, currIcon, "Now");
    
    for (i = 1; i < 7; i++) {
      var nextTemp = dataPoint[(today+i)%7].temperatureMax;
      var nextTemp = ((nextTemp - 32) * (5/9)).toFixed(0); // Convert from F to C
      var nextIcon = dataPoint[(today+i)%7].icon;
      
      addDay(nextTemp, nextIcon, days[(today+i)%7]);
    }
  });
}

function addDay(temp, icon, day) {
  var icons = ['clear-day','clear-night','rain','snow','sleet','wind','fog','cloudy','partly-cloudy-day','partly-cloudy-night'];
  temp = temp + " &#176;C";
  
  if (icons.indexOf(icon) == -1) { // If weather is weird, use default sunny icon.
    icon = "clear-day.png"; 
  }
    
  var img = "<img src=\"img/"+ icon +".png\" style=\"width:100px;height:auto\";>";
    
  appendDoc("weather", "<div id=\"wrapped\"> " + img + "<br>" 
  + "<b>" + temp + "</b>" + "<br>"
  + day + "</div>");
}

function appendDoc(elem, html) {
  old_html = document.getElementById(elem).innerHTML;
  document.getElementById(elem).innerHTML = old_html + html;
}
