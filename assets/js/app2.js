var map = L.map('map').setView([39.9541, -75.1422], 12);
var baselayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
var otherMarkers = new L.MarkerClusterGroup();
var pendingMarkers = new L.MarkerClusterGroup();
var completeMarkers = new L.MarkerClusterGroup();

var geojsonData = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Address</th><td>" + feature.properties.address_full + 
        "</td></tr>" + "<tr><th>Project</th><td>" + feature.properties.project + "</td></tr>" + "<tr><th>Status</th><td>" + feature.properties.status + 
        "</td></tr>" + "<tr><th>House Status</th><td>" + feature.properties.house_status + "</td></tr>" + "<table>";

      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.address_full);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
        }
      });

      var markerTitle = "Address: " + feature.properties.address_full + "<p />Status: " + feature.properties.status;
      var marker = L.marker(new L.LatLng(feature.properties.latitude, feature.properties.longitude), { title: feature.properties.address_full });
      marker.bindPopup(markerTitle);

      if(feature.properties.status == "Complete") {
        completeMarkers.addLayer(marker);
      } else if(feature.properties.status == "Pending") {
        pendingMarkers.addLayer(marker);
      } else {
        otherMarkers.addLayer(marker);
      }
    }
  }
});

$.getJSON("http://www.googledrive.com/host/0B_y8sMJXIwdzR3VKeXN2LWphZEU", function (data) {
  geojsonData.addData(data);
});

var baselayers = {
  "Street View": baselayer
};

var overlays = {
  "Status": {    
    "Complete": completeMarkers,
    "Pending": pendingMarkers,
    "Other": otherMarkers
  }
};

map.addLayer(baselayer);

L.control.groupedLayers(baselayers, overlays).addTo(map);

$(document).one("ajaxStop", function () {
  $("#loading").hide();
  /* Fit map to boroughs bounds */
  map.fitBounds(otherMarkers.getBounds());
});