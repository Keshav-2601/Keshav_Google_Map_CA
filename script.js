var globalMarker=[];
function loadMap() {
    var Searchbar = document.getElementById('searchbar');
    var filterbuttonDiv=document.createElement('div');
    filterbuttonDiv.className="filerDiv";
    var fiterbuttons=['Restraurent','Hotels','Amusement Park','Olympic Stadium'];
    var Allids=['res','hot','Amu','oly'];
    for(let i=0;i<fiterbuttons.length;i++){
        var uniqueButton=document.createElement('button');
        uniqueButton.textContent=fiterbuttons[i];
        uniqueButton.className="variousfilterButton";
        uniqueButton.id=Allids[i];
        filterbuttonDiv.appendChild(uniqueButton);
    }
    document.getElementById("parentElementId").appendChild(filterbuttonDiv);
    
    
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
                        // console.log('status at line 1 is:',status);
                        var placeId = result[0].place_id;
                        var detailsrequest = {
                            placeId: placeId,
                            fields: ['types','formatted_address','place_id','address_components', 'business_status', 'name', 'opening_hours', 'photos', 'rating', 'reviews', 'url', 'vicinity','geometry']
                        };
                        service.getDetails(detailsrequest, function callback(finalresult, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                // console.log('status at line 2 is:',status);
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

        document.getElementById('res').onclick=function(){
            getallRestruarent(map);
        }
            
}

function getallRestruarent(){
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        console.log('Marker:',markerObject.marker);
        console.log('Marker type:',markerObject.type);
        if(markerObject.type!='restraurent'){
            markerObject.marker.setVisible(false);
        }
    }
}

function createMarker(place, map) {
    console.log('place api:',place);
    if (!place.geometry || !place.geometry.location) return;
        const marker = new google.maps.Marker({
            map: map,
            position:place.geometry.location,
            mapId: 'c3a03b34da8f8d5a'
        });
        globalMarker.push({
            marker: marker,
            type: place.types[0]
        });
        const infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>'+'<br>'+place.rating+
                'placeImg:');
            infowindow.open(map, marker);
        });
}

