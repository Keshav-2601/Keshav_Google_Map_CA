var globalMarker=[];
var travelmode="DRIVING";
function loadMap() {
    var Searchbar = document.getElementById('searchbar');
    var filterbuttonDiv=document.createElement('div');
    filterbuttonDiv.className="filerDiv";
    var fiterbuttons=['Restraurent','museum','Amusement Park','Olympic Stadium','All'];
    var Allids=['res','mus','Amu','oly','All'];
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
        zoom: 14,
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
        
        let selectedtypes=[];
        document.getElementById('res').onclick=function(){
            let index=selectedtypes.indexOf('restaurant');
            if(index>-1){
                selectedtypes.splice(index,1);
            }
            else{
                selectedtypes.push('restaurant');
            }
            filterMaker(selectedtypes);
        }
        
        document.getElementById('mus').onclick=function(){
            let index=selectedtypes.indexOf('museum')
            if(index>-1){
                selectedtypes.splice(index,1);
            }
            else{
                selectedtypes.push('museum');
            }
            filterMaker(selectedtypes);
        }    
        document.getElementById('Amu').onclick=function(){
            let index=selectedtypes.indexOf('park');
            if(index>-1){
                selectedtypes.splice(index,1);
            }
            else{
                selectedtypes.push('park');
            }
            filterMaker(selectedtypes);
        }    
        document.getElementById('oly').onclick=function(){
            let index=selectedtypes.indexOf('stadium');
            if(index>-1){
                selectedtypes.splice(index,1);
            }
            else{
                selectedtypes.push('stadium');
            }
            filterMaker(selectedtypes);
        }    
        document.getElementById('All').onclick=function(){
            getallMarker();
        }
        var directionRenderer = new google.maps.DirectionsRenderer({
            suppressPolylines: false
        });

        var directionService = new google.maps.DirectionsService();

        document.getElementById('submitButton').onclick=function(event){
            event.preventDefault();

            calculatedistance(directionService,directionRenderer,map);
        }
        
        directionRenderer.setPanel(document.getElementById('Direction'));

        document.getElementById('kv_Walking').addEventListener('change',function(event){
            if(this.checked){
                travelmode="WALKING"
                calculatedistance(directionService,directionRenderer,map)
            }
           else{
            directionRenderer.setMap(null);
           }
        })
        document.getElementById('kv_Driving').addEventListener('change',function(event){
            if(this.checked){
            travelmode="DRIVING";
            calculatedistance(directionService,directionRenderer,map)
            }
            else{
                directionRenderer.setMap(null);
                
            }
        })
        document.getElementById('kv_Bus').addEventListener('change',function(event){
            if(this.checked){
                travelmode="BUS";
                calculatedistance(directionService,directionRenderer,map)
            }
           else{
            directionRenderer.setMap(null);
           }
           
        })
        document.getElementById('kv_Train').addEventListener('change',function(event){
            if(this.checked){
                travelmode="Train";
                calculatedistance(directionService,directionRenderer,map)
            }
          else{
            directionRenderer.setMap(null);
          }
           
        })
        document.getElementById('kv_Subway').addEventListener('change',function(event){
            if(this.checked){
                travelmode="SUBWAY";
                calculatedistance(directionService,directionRenderer,map)
            }
           else{
            directionRenderer.setMap(null);
           }
           
        })

        document.getElementById('kv_Bicycle').addEventListener('change',function(event){
            if(this.checked){
                travelmode="bICYCLING";
                calculatedistance(directionService,directionRenderer,map)
            }
           else{
            directionRenderer.setMap(null);
           }
           
        })
       
}
function getallMarker(){
 for(let i=0;i<globalMarker.length;i++){
    let markerObject=globalMarker[i];
    markerObject.marker.setVisible(true);
 }
}
function filterMaker(selectedtypes){
    for(let i=0;i<globalMarker.length;i++){
        let markerObject=globalMarker[i];
        let isflag=false;
        for(let j=0;j<markerObject.type.length;j++){
            if(selectedtypes.includes(markerObject.type[j])){
                isflag=true;
            }
        }
        markerObject.marker.setVisible(isflag); 
    }
}


function createMarker(place, map) {
   // console.log('place api:',place);
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
    console.log('Travel mode:',travelmode);
    directionService.route(request,function(result,status){
        console.log('Reseult',result);
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





