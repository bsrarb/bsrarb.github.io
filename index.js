var map;
var overlay;
var content, container, closer;

function initializeMap () {

  var maxExtent = [26.0433512713, 35.8215347357, 44.7939896991, 42.1414848903];
  //Create the map
  map = new ol.Map({
  target: 'map',
  //projection:"EPSG:4326",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    //center: ol.proj.fromLonLat([35.24,38.96]),
    extent: maxExtent,
    zoom: 6.5,
    minZoom: 6.5
  })
  });
  
  map.getView().fit(maxExtent);
}

function askWeather (lat, lng,ind,name) {
  
  var weatherData;
  var api = "bb9f8ab99e9303b38626e44f83f56a41";
  $.getJSON("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid="+api,function(data){
      weatherData = Math.floor(data["main"]["temp"]-273.15);
      console.log("weather: "+weatherData);
    
      //Create necessary elements for new overlay
      var div_popup = document.createElement("div");
      div_popup.setAttribute("id",ind);
      div_popup.setAttribute("class","ol-popup");
    
      var pop_temp = document.createElement("div");
      pop_temp.setAttribute("class","pop-temp");
      pop_temp.innerHTML = weatherData;
      div_popup.appendChild(pop_temp);
    
      var pop_city = document.createElement("div");
      pop_city.setAttribute("class","pop-city");
      pop_city.innerHTML = name;
      div_popup.appendChild(pop_city);
    
      var all_divs = document.getElementById("allpopups");
      all_divs.appendChild(div_popup);

      var our_div = document.getElementById(ind);
      overlay = new ol.Overlay({
          element: our_div,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
        overlay.setPosition([lng,lat]);
        map.addOverlay(overlay);


    })

}


initializeMap();
//connect();


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


var data;
readTextFile("./cities_of_turkey.json", function(text){
  data = JSON.parse(text);
  var index;
  for (index = 1; index < 82; ++index) {
    var lat = data[index-1].latitude;
    var lng = data[index-1].longitude;
    var name = data[index-1].name;
    askWeather(lat,lng,index,name);
  }
});
