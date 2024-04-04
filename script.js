function loadMap() {
    var Searchbar = document.getElementById('searchbar');
    var mapOptions = {
        center: new google.maps.LatLng(54, -6.41),
        zoom: 18,
        mapId: 'c3a03b34da8f8d5a'
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var service = new google.maps.places.PlacesService(map);
    fetch('dummy2.json')
        .then((res) => res.json())
        .then((result) => {
            result.map((res) => {
                var request = {
                    query: res.title,
                    fields: ['place_id']
                };
                service.findPlaceFromQuery(request, function callback(result, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        var placeId = result[0].place_id;
                        var detailsrequest = {
                            placeId: placeId,
                            fields: ['address_components', 'business_status', 'name', 'opening_hours', 'photos', 'rating', 'reviews', 'url', 'vicinity']
                        };

                        service.getDetails(detailsrequest, function callback(finalresult, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                createMarker(finalresult, map);
                            } else {
                                console.error('Error fetching place details:', status);
                            }
                        });
                    } else {
                        console.error('No Places Found:', res.title);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}

function createMarker(place, map) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    const infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            'Place ID: ' + place.place_id + '<br>' +
            place.formatted_address + '</div>');
        infowindow.open(map, marker);
    });
}

