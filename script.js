function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 10,
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}