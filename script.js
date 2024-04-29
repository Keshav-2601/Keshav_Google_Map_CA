var globalMarker = [];
var travelmode = "DRIVING";
function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(48.856614, 2.35222190),
        zoom: 14,
        mapId: 'c3a03b34da8f8d5a'
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var service = new google.maps.places.PlacesService(map);


    fetch('dummy2.json')
        .then((res) => res.json())
        .then((result) => {
            result.map((res) => {
                // console.log('resultis:->',res);
                let Originalurl = res.img;//getting the url
                var request = {
                    query: res.title,
                    fields: ['place_id']
                };
                service.findPlaceFromQuery(request, function callback(result, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        // console.log('status at line 1 is:',status);
                        var placeId = result[0].place_id;
                        var detailsrequest = {
                            placeId: placeId,
                            fields: ['types', 'formatted_address', 'place_id', 'address_components', 'business_status', 'name', 'opening_hours', 'photos', 'rating', 'reviews', 'url', 'vicinity', 'geometry']
                        };
                        service.getDetails(detailsrequest, function callback(finalresult, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                // console.log('status at line 2 is:',status);

                                createMarker(finalresult, map, Originalurl);
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

    let selectedtypes = [];
    document.getElementById('kv_Res').onclick = function () {
        let index = selectedtypes.indexOf('restaurant');
        if (index > -1) {
            selectedtypes.splice(index, 1);
        }
        else {
            selectedtypes.push('restaurant');
        }
        filterMaker(selectedtypes);
    }

    document.getElementById('kv_Mus').onclick = function () {
        let index = selectedtypes.indexOf('museum')
        if (index > -1) {
            selectedtypes.splice(index, 1);
        }
        else {
            selectedtypes.push('museum');
        }
        filterMaker(selectedtypes);
    }
    document.getElementById('kv_Amu').onclick = function () {
        let index = selectedtypes.indexOf('park');
        if (index > -1) {
            selectedtypes.splice(index, 1);
        }
        else {
            selectedtypes.push('park');
        }
        filterMaker(selectedtypes);
    }
    document.getElementById('kv_Oly').onclick = function () {
        let index = selectedtypes.indexOf('stadium');
        if (index > -1) {
            selectedtypes.splice(index, 1);
        }
        else {
            selectedtypes.push('stadium');
        }
        filterMaker(selectedtypes);
    }
    document.getElementById('kv_All').onclick = function () {
        getallMarker();
    }
    var directionRenderer = new google.maps.DirectionsRenderer({
        suppressPolylines: false
    });

    var directionService = new google.maps.DirectionsService();

    document.getElementById('kv_submitButton').onclick = function (event) {
        event.preventDefault();

        calculatedistance(directionService, directionRenderer, map);
    }
    let direcbool = false;
    document.getElementById('kv_showDirection').addEventListener('click', function () {
        direcbool = !direcbool;
        if (direcbool) {
            directionRenderer.setPanel(document.getElementById('kv_Direction'));
        } else {
            directionRenderer.setPanel(null);
        }
    })

    const startcity = document.getElementById('kv_start');
    const endcity = document.getElementById('kv_end');

    const startAutocomplete = new google.maps.places.Autocomplete(startcity);
    const endAutocomplete = new google.maps.places.Autocomplete(endcity);

    startAutocomplete.setFields(['geometry', 'formatted_address']);
    endAutocomplete.setFields(['geometry', 'formatted_address']);

    google.maps.event.addListener(startAutocomplete, 'place_changed', function () {
        const place = startAutocomplete.getPlace();
        if (!place.geometry) {
            console.log('No place is found');
            return;
        }
        const location = place.geometry.location;
        console.log('Selected start location:', location.lat(), location.lng());
    });

    google.maps.event.addListener(endAutocomplete, 'place_changed', function () {
        const place = endAutocomplete.getPlace();
        if (!place.geometry) {
            console.log('No place is found');
            return;
        }
        const location = place.geometry.location;
        console.log('Selected end location:', location.lat(), location.lng());
    });
    const currencyconvertor = document.getElementById('kv_button');
    currencyconvertor.addEventListener('click', function () {
        const host = 'api.frankfurter.app';
        const currentvalue = document.getElementById('kv_initalValue').value;
        const from_value = document.getElementById('kv_from_Selected').value;
        const to_value = document.getElementById('kv_to_Selected').value
        fetch(`https://${host}/latest?amount=${currentvalue}&from=${from_value}&to=${to_value}`)
            .then((result) => result.json()).catch((error) => console.log('erroris :->', error))
            .then((res) =>
                document.getElementById('kv_result').value = res.rates[to_value]
            );
    })
    
    document.getElementById('kv_langButton').addEventListener('click', function () {
        const text = document.getElementById('kv_para').textContent;
        const options = {
            method: 'POST',
            headers: {
                Authorization: ` Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiM2I1MDgzMmMtNDFkMi00Y2Q1LWI4ZDEtMmNkNzEzZTY5OGQyIiwidHlwZSI6ImFwaV90b2tlbiJ9.iUMJFGE1ibnYRKeswIRTFnogE8xvXXR9zTSP4mxf_M0`,
                accept: 'application/json', 'content-type': 'application/json'
            },
            body: JSON.stringify({
                response_as_dict: true,
                attributes_as_list: false,
                show_original_response: false,
                providers: 'amazon',
                text: `${text}`
            })
        };
        let detect_language = null;
        fetch('https://api.edenai.run/v2/translation/language_detection', options)
            .then(response => response.json())
            .then(response => {
                detect_language = (response.amazon.items[0].display_name);
                console.log(detect_language)
                let to_value = document.getElementById('kv_lanOptions').value;
                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'X-RapidAPI-Key': 'f6bd5cdf99mshceda3653ead26aap13ae90jsn119819c1fa7a',
                        'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
                    },
                    body: new URLSearchParams({
                        text: `${text}`,
                        to: `${to_value}`,
                        from: `${detect_language}`
                    })
                };
                fetch(`https://nlp-translation.p.rapidapi.com/v1/translate`, options)
                    .then((res) => res.json()).catch((error) => console.log(error))
                    .then((result) => {
                        console.log('result:', result);
                        document.getElementById('kv_para').textContent = result.translated_text[document.getElementById('kv_lanOptions').value];
                    }).catch((error) => console.log(error));

            })
            .catch(err => console.error('The error is :->', err));
    })
}

function getallMarker() {
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        markerObject.marker.setVisible(true);
    }
}
function filterMaker(selectedtypes) {
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        let isflag = false;
        for (let j = 0; j < markerObject.type.length; j++) {
            if (selectedtypes.includes(markerObject.type[j])) {
                isflag = true;
            }
        }
        markerObject.marker.setVisible(isflag);
    }
}


function createMarker(place, map, url) {
    console.log('place api:', place);
    if (!place.geometry || !place.geometry.location) return;
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        mapId: 'c3a03b34da8f8d5a',
        icon: {
            url: url,
            scaledSize: new google.maps.Size(40, 40),
        }
    });
    globalMarker.push({
        marker: marker,
        type: place.types
    });
    const infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", () => {
        let content = '<div><strong>' + place.name + '</strong><br>' +
            '<strong>Business_status:</strong> ' + place.business_status + '<br>' + '<br>' + '<strong>Address:</strong>' +
            place.formatted_address + '</div>' + '<br>' + '<strong>Opening Hours:</strong>';
        if (place.opening_hours && place.opening_hours.weekday_text) {
            for (let i = 0; i < place.opening_hours.weekday_text.length; i++) {
                content += '<br>' + place.opening_hours.weekday_text[i] + '<br>';
            }
        }
        else {
            content += '<br>' + '<strong>No info about days</strong>' + '<br>';
        }
        'Rating:';
        if (place.rating) {
            for (let i = 0; i < Math.floor(place.rating); i++) {
                content += '<span style="color: gold;">&#9733;</span>';
            }
            if (place.rating % 1 > 0) {
                content += '<span style="color: gold;">&#9734;</span>';
            }
        } else {
            content += 'Not available';
        }
        'placeImg:';
        if (place.photos) {
            place.photos.forEach(photo => {
                content += '<br><img src="' + photo.getUrl() + '" style="width: 200px; height: 200px;">';
            });
        }
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });
}
function calculatedistance(directionService, directionRenderer, map) {
    let start = document.getElementById('kv_start').value;
    let end = document.getElementById('kv_end').value;
    travelmode = document.getElementById('kv_travellOptions').value;
    console.log('start:', start);
    console.log('End:', end);

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[travelmode]
    };
    if (travelmode === 'TRANSIT') {
        let transitOptions = [];
        if (document.getElementById('kv_busTransit').checked) {
            transitOptions.push('BUS');
        }
        if (document.getElementById('kv_trainTransit').checked) {
            transitOptions.push('TRAIN');
        }

        if (document.getElementById('kv_subwayTransit').checked) {
            transitOptions.push('SUBWAY');
        }
        request.transitOptions = {
            modes: transitOptions
        }

    }
    console.log('Travel mode:', travelmode);
    directionService.route(request, function (result, status) {
        console.log('Reseult', result);
        if (status == google.maps.DirectionsStatus.OK) {
            console.log('Directions result:', result);
            directionRenderer.setDirections(result);
            directionRenderer.setMap(map);
        }
        else {
            console.log("Error not getting any route");
        }
    })
}





