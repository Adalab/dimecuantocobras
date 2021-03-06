var def_style = {
  fillColor: '#ffeda0',
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '1',
  fillOpacity: 0.8
};

var mymap;
var current_city = 'Barcelona';
var cityLookup = {
		    'Madrid':[40.45, -3.76, 11],
		    'Barcelona':[41.4, 2.08, 12]
};


function calculateColor(percentage) {
  if(percentage > 50) {
    return '#6e1c0f';
  } else if (percentage > 45 && percentage <= 50) {
    return '#94341c';
  } else if (percentage > 41 && percentage <= 45) {
    return '#bc6c25';
  } else if (percentage > 36 && percentage <= 41) {
    return '#d6a500';
  } else if (percentage > 30 && percentage <= 36) {
    return '#7b8815';
  } else if (percentage <= 30) {
    return '#55790e';
  }
}

function calculatePercentage(feature) {
  // totalPrecioApartamento = feature.properties.q20164 x tamaño
  var salary = parseFloat($('#map-salary').val());
  var apartmentSize = parseFloat($('#map-apartment-size').val());
  var apartmentRent = parseFloat(feature.properties.q20164) * apartmentSize;
  return (apartmentRent / salary)*100;
}

function dynamicStyle(feature) {
  var percentage = calculatePercentage(feature);
  var color = calculateColor(percentage);
  return {
    fillColor: color,
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '1',
    fillOpacity: 0.4,
  };
}

var current_year = '2016';
var jsonLayer = new L.GeoJSON.AJAX(["data/BarcelonaDistrictsDatosIdealista.geojson", "data/MadridDistrictsDatosIdealista.geojson"],{
  filter:setByCity,
  onEachFeature: popUp,
  style: dynamicStyle
});

function changeCurrentCity(newcity){

		    current_city=newcity;
		    jsonLayer.refresh();
		    mymap.setView(new L.LatLng(cityLookup[current_city][0], cityLookup[current_city][1]),cityLookup[current_city][2]);

};


function changeCurrentYear(newyear){
		    current_year=newyear;
		    jsonLayer.refresh();
};

// set the filter based on values from geojson file - only display elements for currently selected city
function setByCity(f,l){

		    if (current_city === f.properties.city) {
					return true;}
};


function popUp(f,l){
    var out = [];
		    if (f.properties){
					out.push("Distrito: "+f.properties['name']);
					for(key in f.properties){
							    if (new RegExp(current_year).test(key)){
										out.push(current_year+" T"+key.slice(-1)+": Precio m² - €"+f.properties[key]);

							    }

					}
		    }
        l.bindPopup(out.join("<br />"));

};





$(document).ready(function(){
  mymap = L.map('map');


  // create the tile layer with correct attribution
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.StamenTileLayer("toner", {minZoom: 4, maxZoom: 12});

  mymap.setView(new L.LatLng(cityLookup[current_city][0], cityLookup[current_city][1]),cityLookup[current_city][2]);
  mymap.addLayer(osm);

  mymap.addLayer(jsonLayer);
  // set the zoom limits for the map
  mymap.options.maxZoom = 15;
  mymap.options.minZoom = 6;

  $('.btn-madrid').on('click', function(){
    $('.btn-barcelona').removeClass('btn-focus');
    $(this).addClass('btn-focus');
    changeCurrentCity('Madrid');
  });

  $('.btn-barcelona').on('click', function(){
    $('.btn-madrid').removeClass('btn-focus');
    $(this).addClass('btn-focus');
    changeCurrentCity('Barcelona');
  });


  $('.selection-map input[type="range"]').on('change', function(){
    $('#map-salary-value').html($('#map-salary').val());
    $('#map-apartment-size-value').html($('#map-apartment-size').val());
    changeCurrentCity(current_city);
  });




















});




