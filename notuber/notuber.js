/* comp20 a2 - js for notuber
 * Michelle Luo (mluo02)
 */

function getLocation() {
    var req = new XMLHttpRequest();
    var dest = "https://defense-in-derpth.herokuapp.com/submit";
    var data;
    var map;
    var where;
    var marker;
    var lat;
    var lng;

    /* getting location from HTML5 API */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            document.getElementById("info-div").innerHTML =
            "<h3>Your location</h3>" + "<p>" + lat + ", " + lng + "</p>";

            data = "username=TRAM96zq&lat=" + lat + "&lng=" + lng;

            /* using location data to make Google Maps map */
            where = new google.maps.LatLng(lat, lng);
            map = new google.maps.Map(document.getElementById("map"), {
                center: where,
                zoom: 17
            });

            /* marker -- testing purposes */
            marker = new google.maps.Marker({
                position: where,
                map: map
            })

            /* send data to datastore -- which can only be done after
             * location data is retrieved */
            req.open("POST", dest, true);
            req.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
            req.send(data);
        });
    }

    req.onload = function () {
        /* parse json */
        /* var vehicleData = this.responseText.split(?); */
    }

}
