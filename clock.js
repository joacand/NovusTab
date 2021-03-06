var d = new Date();
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var day = days[ d.getDay() ];
var month = months[ d.getMonth() ];
var dateOut = "<b>"+day.concat("</b>, ").concat(month).concat(" ").concat(d.getDate());
var APIKEY = "YourKeyHere"; // Hide in PHP later

// Default long/lat coordinates are used if user denies geolocation or if geolocation
// is not available
var longitude = 18.0686;
var latitude = 59.3294;

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
  
  reverseGeo(latitude, longitude);
}

function locationError(err) {
  // If Geolocation is not working, start with default location
  reverseGeo(latitude, longitude);
}

function reverseGeo(lat, lon) {
  var city  = "";
  var cityS = "";
  var cityL = "";
  
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat, lon);
  
  // Reverse geocode to get the city of the user
  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    var result = results[0];
    
    if (result == null) {
      weather(lat, lon, "");
      return;
    }
    var len = result.address_components.length;

    for (i = 0; i < len; i++) {
      var ac = result.address_components[i];

      if (ac.types.indexOf("administrative_area_level_2") >= 0) {
        cityS = "<b>"+ac.short_name+"</b>";
      } else if (ac.types.indexOf("administrative_area_level_1") >= 0) {
        cityL = ac.short_name;
      }
    }
    
    if (cityL != "" && cityS != "") {
      city = cityS + ", " + cityL;
    } else if (cityL == "") {
      city = cityS;
    } else {
      city = cityL;
    }
    
    weather(lat, lon, city);
  });
}

function weather(wLatitude, wLongitude, city) {
  var d = new Date();
  var today = d.getDay(); // 0 = Sunday
  
  // Format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE,TIME
  var apiURL = "https://api.forecast.io/forecast/" + APIKEY + 
               "/" + wLatitude + "," + wLongitude;
  
  $.getJSON(apiURL + "?callback=?", function(data) {
    var currTemp = ((data.currently.temperature - 32) * (5/9)).toFixed(0); // Convert from F to C
    var currIcon = data.currently.icon;
    var dataPoint = data.daily.data;

    addDay(currTemp, currIcon, "<b>Now</b>", 4, 5);
    
    for (i = 1; i < 7; i++) {
      var nextTemp = dataPoint[(today+i)%7].temperatureMax;
      var nextTemp = ((nextTemp - 32) * (5/9)).toFixed(0); // Convert from F to C
      var nextIcon = dataPoint[(today+i)%7].icon;
      
      addDay(nextTemp, nextIcon, days[(today+i)%7], 2.6, 3);
    }
  });
  
  appendDoc("location", city);
}

function addDay(temp, icon, day, height, fontSize) {
  var icons = ['clear-day','clear-night','rain','snow','sleet','wind','fog','cloudy','partly-cloudy-day','partly-cloudy-night'];
  temp = temp + " &#176;C";
  
  if (icons.indexOf(icon) == -1) { // If weather is weird, use default sunny icon
    icon = "clear-day.png"; 
  }
    
  var img = "<img src=\"img/"+ icon +".png\" class=\"wIcon\" style=width:auto;height:"+height+"vw;\";>";
    
  appendDoc("weather", "<div id=\"wrapped\"> " + img + "<br>" 
  + "<b><p style=font size:"+fontSize+"vw>" + temp + "</b>" + "<br>"
  + day + "</p></div>");
}

function appendDoc(elem, html) {
  old_html = document.getElementById(elem).innerHTML;
  document.getElementById(elem).innerHTML = old_html + html;
}

