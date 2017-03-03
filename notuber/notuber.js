/*
 * comp20 a2 - js for notuber
 * Michelle Luo (mluo02)
 */

function displayYourLocation(lat, lng) {
     document.getElementById("info-div").innerHTML =
         "<h1>notuber</h1>" + "<h2>your location</h2>" + "<p>" + lat
         + ", " + lng + "</p>" + "<hr/>";
 }

function addMarkers(passenger, map, vehicles, img) {
    var info = document.getElementById("info-div");

    for (var i = 0, v; v = vehicles[i]; i++) {
        var pos = new google.maps.LatLng(v.lat, v.lng);
        var marker = new google.maps.Marker({
            position: pos,
            icon: img,
            map: map
        });

        var dist = google.maps.geometry.spherical.computeDistanceBetween(
                    passenger.getPosition(), marker.getPosition());

        var contentString = '<div id="content"><h4 id="firstHeading">' +
            v._id + "</h4>" + "<h5>distance from you:</h5>" + dist +
            "<p>" + v.lat + ", " + v.lng + "</p></div>";

        var infoWindow = new google.maps.InfoWindow({
                    content: contentString
        });

        marker.addListener('click', function() {
            infoWindow.open(map, this);
        });
    }
}

function getLocation() {
    var req = new XMLHttpRequest();
    var dest = "https://defense-in-derpth.herokuapp.com/submit";
    var data;
    var map;
    var where;
    var passenger;
    var vehicle;
    var lat;
    var lng;
    var vehicles;

    /* getting location from HTML5 API */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            displayYourLocation(lat, lng);

            data = "username=" + user.username + "=" + lat + "&lng=" + lng;

            /* using location data to make Google Maps map */
            where = new google.maps.LatLng(lat, lng);
            map = new google.maps.Map(document.getElementById("map"), {
                center: where,
                zoom: 17
            });

            /* passenger marker */
            marker = new google.maps.Marker({
                position: where,
                icon: "passenger.png",
                map: map
            });

            var contentString = '<div id="content"><h4 id="firstHeading">' +
                user.username + "</h4>" +
                "<p>" + lat + ", " + lng + "</p></div>";

            var infoWindow = new google.maps.InfoWindow({
                        content: contentString
            });

            marker.addListener('click', function() {
                infoWindow.open(map, this);
            });

            /* send data to datastore -- which can only be done after
             * location data is retrieved */
            req.open("POST", dest, true);
            req.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
            req.onload = function () {
                var res = JSON.parse(this.responseText);
                vehicles = res.vehicles;
                addMarkers(marker, map, vehicles, "black_car.png");
            }
            req.send(data);
        });
    }
    else {
        alert("Your browser doesn't support geolocation :(");
    }
}












/* end */
