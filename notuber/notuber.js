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
    var me;
    var myImg;
    var lat;
    var lng;
    var arr;
    var them;
    var theirImg;

    /* getting location from HTML5 API */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            /* send data to datastore -- which can only be done after
             * location data is retrieved */
            req.open("POST", dest, true);
            req.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");

            req.onload = function () {
                var res = JSON.parse(this.responseText);
                if (res.hasOwnProperty('vehicles')) {
                    them = res.vehicles;
                    myImg = "passenger.png";
                    theirImg = "black_car.png";
                }
                else {
                    them = res.passengers;
                    myImg = "black_car.png";
                    theirImg = "passenger.png";
                }

                /* use location data to make Google Maps map */
                me = new google.maps.LatLng(lat, lng);
                map = new google.maps.Map(document.getElementById("map"), {
                    center: me,
                    zoom: 17
                });
                var contentString = '<div id="content"><h3 id="firstHeading">' +
                    user.username + "</h3>" + "<p>" + lat + ", " + lng +
                    "</p></div>";
                var info = new google.maps.InfoWindow({
                        content: contentString
                });

                /* put myself on map */
                addMarker(me, myImg, map, contentString, info);
                addVehicleMarkers(me, map, them, theirImg, info);
            }
            data = "username=" + user.username + "=" + lat + "&lng=" + lng;
            req.send(data);
        });
    }
    else {
        alert("Your browser doesn't support geolocation :(");
    }
}


function addVehicleMarkers(me, map, them, img, info)
{
    var pos;
    var dist;
    var contentString;
    for (var i = 0, v; v = them[i]; i++) {
        pos = new google.maps.LatLng(v.lat, v.lng);
        dist = METERS_TO_MILES *
                    google.maps.geometry.spherical.computeDistanceBetween(pos,
                    me);
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
