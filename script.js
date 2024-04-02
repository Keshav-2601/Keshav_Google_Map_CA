function loadMap() {
    var Searchbar=document.getElementById('searchbar');
    var mapOptions = {
        center: new google.maps.LatLng(54, -6.41),
        zoom: 18,
        mapId:'c3a03b34da8f8d5a'
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var service = new google.maps.places.PlacesService(map);
   fetch('dummy.json').then((res)=>res.json()).then((result)=>{
    result.map((res)=>{
        var request = {
            query: res.title,
            fields: ['place_id']
        };
        service.findPlaceFromQuery(request,function callback(result,status){
            if(status==google.maps.places.PlacesService.OK){
                var placeId = result[0].place_id;
                var detailsrequest={
                    placeId:placeId,
                    fields:['address_components', 'business_status', 'name', 'opening_hours', 'photos', 'rating', 'reviews', 'url', 'vicinity']
                }

                service.getDetails(detailsrequest,function callback(finalresult,status){
                    if(status==google.maps.places.PlacesService.OK){
                        var marker=new google.maps.Marker({
                            map:map,
                            position:finalresult.geometry.location
                        }) 
                        var InfoWindow=new google.maps.InfoWindow();
                        google.maps.event.addListener(marker,'click',function(){
                            InfoWindow.setContent('<div><strong>' + finalresult.name + '</strong><br>' +
                            'Place ID: ' + finalresult.place_id + '<br>' +
                            finalresult.formatted_address + '</div>')
                            InfoWindow.open(map,this)
                        })
                    }else {
                        console.error('Error fetching place details:', status);
                    }
                })
            } else {
                console.error('No Places Found:', res.title);
            }
        })
    })
   }).catch(error => {
    console.error('Error fetching JSON:', error)
    }
   )
}

/**
 * Places API-functions
 * 1)nearbySearch()
 * 2)Textsearch()
 * 3)Findplace()
 * 4)getdetails()-{
 *              i)address components
 *              ii) Business status
 *              iii)Name
 *              iv)Opening hours
 *               v)Images
 *              vi)rating
 *              vii)Reviews
 *              viii)Url for locations
 *              ix)vicinity--A simplified address for the place, including the street name, street number, and locality, 
 *                           but not the province/state, postal code, or country. For example,
 *                           Google's Sydney, Australia office has a vicinity value of 5/48 Pirrama Road, Pyrmont
 *              }
 * 
 *
 **/
