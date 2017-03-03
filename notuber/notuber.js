/*
 * comp20 a2 - js for notuber
 * Michelle Luo (mluo02)
 */

function addVehicleMarkers(passenger, map, vehicles, img) {
    for (var i = 0, v; v = vehicles[i]; i++) {
        var pos = new google.maps.LatLng(v.lat, v.lng);
        var dist = google.maps.geometry.spherical.computeDistanceBetween(
                    passenger, pos);
        var contentString = '<div id="content"><h4 id="firstHeading">' +
            v._id + "</h4>" + "<h5>distance from you:</h5>" + dist +
            "<p>" + pos.lat() + ", " +
            pos.lng() + "</p></div>";

        addMarker(map, pos, img, contentString);
    }
}

function addMarker(map, position, img, contentString) {
    var marker = new google.maps.Marker({
        position: position,
        icon: img,
        map: map
    });

    var info = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        info.open(map, this);
    });
}

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

            /* using location data to make Google Maps map */
            passenger = new google.maps.LatLng(lat, lng);
            map = new google.maps.Map(document.getElementById("map"), {
                center: passenger,
                zoom: 17
            });
            var contentString = '<div id="content"><h4 id="firstHeading">' +
                user.username + "</h4>" + "<p>" + lat + ", " + lng +
                "</p></div>";

            addMarker(map, passenger, "passenger.png", contentString);

            /* send data to datastore -- which can only be done after
             * location data is retrieved */
            req.open("POST", dest, true);
            req.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
            req.onload = function () {
                var res = JSON.parse(this.responseText);
                vehicles = res.vehicles;
                addVehicleMarkers(passenger, map, vehicles, "black_car.png");
            }
            data = "username=" + user.username + "=" + lat + "&lng=" + lng;
            req.send(data);
        });
    }
    else {
        alert("Your browser doesn't support geolocation :(");
    }
}
