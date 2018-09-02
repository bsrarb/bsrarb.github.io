var map;
var vectorSource;
var overlay;
var content, container, closer;
function initializeMap () {

  var maxExtent = [35.24,38.96,35.24,38.96]
  //Create the map
  map = new ol.Map({
  target: 'map',
  projection:"EPSG:4326",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([35.24,38.96]),
    extent: ol.proj.transformExtent(maxExtent,'EPSG:4326', 'EPSG:3857'),
    zoom: 6.5,
    minZoom: 6.5
  })
  });

  //Restrict the map

}

function connect() {

  //Connect to php for db
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //Show data in corresponding popup
      //showDataInPopup(lat,lng,wea);
        //document.getElementById("dataCont").innerHTML = this.responseText; 
    }
  };
  xmlhttp.open("GET","dbcon.php",true);
  xmlhttp.send();
}


var city_weathers = {};
function askWeather (lat, lng,ind,name) {
  
  var weatherData;
  
  var api = "bb9f8ab99e9303b38626e44f83f56a41";
  $.getJSON("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid="+api,function(data){
      weatherData = Math.floor(data["main"]["temp"]-273.15);
      console.log("weather: "+weatherData);
      //iconStyle.setText(weatherData);

      //$("#weather").html(weatherData);
      //$("#city-name").html(data["name"]);

//weatherData=34;
          //Create necessary elements for new overlay
    var div_popup = document.createElement("div");
    div_popup.setAttribute("id",ind);
    div_popup.setAttribute("class","ol-popup");
    //var div_closer = document.createElement("a");
    //div_closer.setAttribute("href","#");
    //div_closer.setAttribute("class","ol-popup-closer");
    //div_popup.appendChild(div_closer);
    var div_content = document.createElement("p");
    div_content.setAttribute("id",ind+"cont");
    div_content.setAttribute("style","display: inline;");
    div_popup.appendChild(div_content);
    var all_divs = document.getElementById("allpopups");
    all_divs.appendChild(div_popup);
    var cityname = document.createElement("p");
    cityname.innerHTML = name;
    cityname.setAttribute("style","display: inline;");
    div_popup.appendChild(cityname);

    var our_div = document.getElementById(ind);
    var our_content = document.getElementById(ind+"cont");

    overlay = new ol.Overlay({
        element: our_div,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      overlay.setPosition(ol.proj.transform([parseFloat(lng),parseFloat(lat)],'EPSG:4326', 'EPSG:3857'));
      our_content.innerHTML = weatherData;
      map.addOverlay(overlay);

      //save to array
      city_weathers[ind] = weatherData;
      //Send data to php
      var xhttp; 

/*
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
        }
      };
      xhttp.open("GET", "saveData.php?temperature="+weatherData, true);
      xhttp.send();

      //console.log("send: "+name+"  "+weatherData);*/

    })

}


function getWeather (lat, lng,ind,name) {
    weatherData = city_weathers[ind];
    var div_popup = document.createElement("div");
    div_popup.setAttribute("id",ind);
    div_popup.setAttribute("class","ol-popup");
    //var div_closer = document.createElement("a");
    //div_closer.setAttribute("href","#");
    //div_closer.setAttribute("class","ol-popup-closer");
    //div_popup.appendChild(div_closer);
    var div_content = document.createElement("div");
    div_content.setAttribute("id",ind+"cont");
    div_content.setAttribute("class","popup-content");
    div_content.setAttribute("style","display: inline-block;");
    div_popup.appendChild(div_content);
    var all_divs = document.getElementById("allpopups");
    all_divs.appendChild(div_popup);
    var cityname = document.createElement("p");
    cityname.innerHTML = name;
    cityname.setAttribute("style","display: inline-block;");
    div_popup.appendChild(cityname);

    var our_div = document.getElementById(ind);
    var our_content = document.getElementById(ind+"cont");

    overlay = new ol.Overlay({
        element: our_div,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      overlay.setPosition(ol.proj.transform([parseFloat(lng),parseFloat(lat)],'EPSG:4326', 'EPSG:3857'));
      our_content.innerHTML = weatherData;
      map.addOverlay(overlay);

}

initializeMap();
//connect();

var cities = [];
var lats = [];
var longs = [];
var names = [];
var limit = 3;
var data;


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}



readTextFile("./cities_of_turkey.json", function(text){
  data = JSON.parse(text);
  var index;
  for (index = 1; index < 82; ++index) {
    var lat = data[index-1].latitude;
    var lng = data[index-1].longitude;
    var name = data[index-1].name;
    lats.push(lat);
    longs.push(lng);
    names.push(name);
    cities.push([]);
    cities[index-1].push(lat);
    cities[index-1].push(lng);
    cities[index-1].push(name);
    askWeather(lat,lng,index,name);
    //popupCity(lat,lng); 
    
  }
});






function newRefresh () {

  //Delete all divs
  var i;
  for(i=1;i<82;i++)
  {
    var elem = document.getElementById(i);
    if (typeof(elem) != 'undefined' && elem != null)
    {
      elem.remove();

    }
  }

/*
  //Create the new ones
  var data;
readTextFile("./cities_of_turkey.json", function(text){
  data = JSON.parse(text);
  var index;
  for (index = 1; index < 82; ++index) {
    var lat = data[index-1].latitude;
    var lng = data[index-1].longitude;
    var name = data[index-1].name;
    askWeather(lat,lng,index,name);
    //popupCity(lat,lng); 
    
  }
});*/
  
}

function savedRefresh () {
  //Delete all divs
  var i;
  for(i=1;i<82;i++)
  {
    var elem = document.getElementById(i);
    if (typeof(elem) != 'undefined' && elem != null)
    {
      elem.remove();

    }
  }


  //Create the new ones from existing data
  var data;
readTextFile("./cities_of_turkey.json", function(text){
  data = JSON.parse(text);
  var index;
  for (index = 1; index < 82; ++index) {
    var lat = data[index-1].latitude;
    var lng = data[index-1].longitude;
    var name = data[index-1].name;
    getWeather(lat,lng,index,name);
    //popupCity(lat,lng); 
    
  }
});


}



//Session storage, try


