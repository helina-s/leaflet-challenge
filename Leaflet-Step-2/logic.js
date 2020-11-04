// Use this link to get the geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab the GeoJSON data
d3.json(link, function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        // Define function to run "onEach" feature 
        onEachFeature: function (feature, layer) {

            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
        }, pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.properties.mag),
                    fillOpacity: 1.5,
                    stroke: false,
                })
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define satelitemap and darkmap layers
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layer
    var baseMaps = {
        "Satelite": satelitemap,
        "Outdoors": outdoorsmap
    };

    // Create overlay object
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, with the streetmap
    var myMap = L.map("map", {
        center: [40.7, -94.5],
        zoom: 3.5,
        layers: [satelitemap, outdoorsmap, earthquakes]
    });

    // Pass our map layer into our layer control and add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};

// Function to determine marker size based on magnitude
function markerSize(mag) {
    return mag * 20000;
}
function markerColor(mag) {
    if (mag <= 1) {
        return "#ADFF2F";
    } else if (mag <= 2) {
        return "#9ACD32"
    } else if (mag <= 3) {
        return "#e1ff00";
    } else if (mag <= 4) {
        return "#ffd700";
    } else if (mag <= 5) {
        return "#ffa500";
    } else {
        return "#FF0000";
    };
}