function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(53.35, -6.26),
        zoom: 10,
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}