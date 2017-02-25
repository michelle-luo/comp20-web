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

            displayYourLocation(lat, lng);

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
        var res = JSON.parse(this.responseText);
        displayVehicleInfo(res);
    }
}

function displayYourLocation(lat, lng) {
    document.getElementById("info-div").innerHTML =
        "<h1>notuber</h1>" + "<h2>your location</h2>" + "<p>" + lat
        + ", " + lng + "</p>" + "<hr/>";
}

function displayVehicleLocation(username, lat, lng) {
    info.append("<h4>" + username + "</h4>" + "<p>" + lat + ", " + lng
        + "</p>");
}

function displayVehicleInfo(res) {
    var info = document.getElementById("info-div");
    var arr1 = res;
    info.innerHTML += "<h2>vehicles</h2>";

    for (var obj in arr1) {
        var arr2 = arr1[obj];
        for (var vehicle in arr2) {
            info.innerHTML += "<h4>" + arr2[vehicle].username + "</h4>"
                + "<p>" + arr2[vehicle].lat + ", " + arr2[vehicle].lng
                + "</p>";
        }
    }
}














/* end */
