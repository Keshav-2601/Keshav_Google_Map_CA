var globalMarker=[];
var travelmode="DRIVING";
function loadMap() {
    var Searchbar = document.getElementById('searchbar');
    var filterbuttonDiv=document.createElement('div');
    filterbuttonDiv.className="filerDiv";
    var fiterbuttons=['Restraurent','museum','Amusement Park','Olympic Stadium'];
    var Allids=['res','mus','Amu','oly'];
    for(let i=0;i<fiterbuttons.length;i++){
        var uniqueButton=document.createElement('button');
        uniqueButton.textContent=fiterbuttons[i];
        uniqueButton.className="variousfilterButton";
        uniqueButton.id=Allids[i];
        filterbuttonDiv.appendChild(uniqueButton);
    }
    document.getElementById("parentElementId").appendChild(filterbuttonDiv);
   
    var mapOptions = {
        center: new google.maps.LatLng(48.856614, 2.35222190),
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
           
            getallRestaurants();
        }
        document.getElementById('mus').onclick=function(){
            getallMuseum();
        }    
        document.getElementById('Amu').onclick=function(){
            getallAmusementPark();
        }    
        document.getElementById('oly').onclick=function(){
            getallOlympicParks();
        }    

        //route planner
        var directionRenderer = new google.maps.DirectionsRenderer({
            suppressPolylines: false
        });
        var directionService = new google.maps.DirectionsService();
        document.getElementById('submitButton').onclick=function(){
            calculatedistance(directionService,directionRenderer,map);
        }
        document.getElementById('Walking').addEventListener('click',function(event){
            travelmode="WALKING"
            
        })
        document.getElementById('Driving').addEventListener('click',function(event){
            travelmode="DRIVING";
            
        })
        document.getElementById('Transit').addEventListener('click',function(event){
            travelmode="TRANSIT";
           
        })
       
}

function getallRestaurants() {
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        let isres=false;
        for(let j=0;j<markerObject.type.length;j++){
            if(markerObject.type[j]==='restaurant'){
                isres=true;
                break;
            }
            markerObject.marker.setVisible(isres);
        }
    }
}
function getallMuseum(){
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        let ismus=false;
        for (let j = 0; j < markerObject.type.length; j++) {
            if (markerObject.type[j] === 'museum') {
                ismus=true;
                break;
            }
            markerObject.marker.setVisible(ismus);
        }
    }
}
function getallAmusementPark(){
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        let isAmu=false;
        for (let j = 0; j < markerObject.type.length; j++) {
            if (markerObject.type[j] === 'park') {
                isAmu=true;
                break;
            }
            markerObject.marker.setVisible(isAmu);
        }
    }
}
function getallOlympicParks(){
    for (let i = 0; i < globalMarker.length; i++) {
        let markerObject = globalMarker[i];
        let issta=false;
        for (let j = 0; j < markerObject.type.length; j++) {
            if (markerObject.type[j] === 'stadium') {
                issta=true;
                break;
            }
            markerObject.marker.setVisible(issta);
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
        type: place.types
    });
    const infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", () => {
        let content = '<div><strong>' + place.name + '</strong><br>' +
            'Place ID: ' + place.place_id + '<br>' +
            place.formatted_address + '</div>'+'<br>'+place.rating+
            'placeImg:';
        if (place.photos) {
            place.photos.forEach(photo => {
                content += '<br><img src="'+ photo.getUrl() + '" style="width: 200px; height: 200px;">';
            });
        }
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });
}
function calculatedistance(directionService,directionRenderer,map){
    let start=document.getElementById('start').value;
    let end=document.getElementById('end').value;
    console.log('start:',start);
    console.log('End:',end);
    
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[travelmode]
    };
    directionService.route(request,function(result,status){
        if(status==google.maps.DirectionsStatus.OK){
            console.log('Directions result:', result);
            directionRenderer.setDirections(result);// use setdirection to get blue line okay
            directionRenderer.setMap(map);
        }
        else{
            console.log("Error not getting any route");
        }
    })
}
//Route Planner starting 
