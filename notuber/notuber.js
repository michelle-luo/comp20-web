/*
 * comp20 a2 - js for notuber
 * Michelle Luo (mluo02)
 */

var METERS_TO_MILES = 0.000621371;

function getLocation() {
    var req = new XMLHttpRequest();
    var dest = "https://defense-in-derpth.herokuapp.com/submit";
    var data;
    var map;
    var passenger;
    var lat;
    var lng;
    var vehicles;

    /* getting location from HTML5 API */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            /* use location data to make Google Maps map */
            passenger = new google.maps.LatLng(lat, lng);
            map = new google.maps.Map(document.getElementById("map"), {
                center: passenger,
                zoom: 17
            });
            var contentString = '<div id="content"><h3 id="firstHeading">' +
                user.username + "</h3>" + "<p>" + lat + ", " + lng +
                "</p></div>";

            var info = new google.maps.InfoWindow({
                    content: contentString
            });
            /* put passenger on map */
            addMarker(passenger, "passenger.png", map, contentString, info);

            /* send data to datastore -- which can only be done after
             * location data is retrieved */
            req.open("POST", dest, true);
            req.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
            req.onload = function () {
                var res = JSON.parse(this.responseText);
                vehicles = res.vehicles;
                addVehicleMarkers(passenger, map, vehicles,
                    "black_car.png", info);
            }
            data = "username=" + user.username + "=" + lat + "&lng=" + lng;
            req.send(data);
        });
    }
    else {
        alert("Your browser doesn't support geolocation :(");
    }
}


function addVehicleMarkers(passenger, map, vehicles, img, info)
{
    var pos;
    var dist;
    var contentString;
    for (var i = 0, v; v = vehicles[i]; i++) {
        pos = new google.maps.LatLng(v.lat, v.lng);
        dist = METERS_TO_MILES *
                    google.maps.geometry.spherical.computeDistanceBetween(pos,
                    passenger);
        dist = dist.toFixed(4);
        contentString = '<div id="content"><h3 id="firstHeading">' +
            v._id + "</h3>" + "<p>distance from you: " + dist + " mi</p>";
        addMarker(pos, img, map, contentString, info);
    }
}

function addMarker(pos, img, map, contentString, info) {
    var marker = new google.maps.Marker({
        position: pos,
        icon: img,
        map: map
    });
    /* attach listener to marker - changes content of the infowindow,
     * then sets infowindow at the clicked marker */
    marker.addListener('click', function() {
        info.setContent(contentString);
        info.open(map, this);
    });
}
