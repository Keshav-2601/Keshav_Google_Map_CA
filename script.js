function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(54, -6.41),
        zoom: 18,
        mapId:'c3a03b34da8f8d5a'
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
   fetch('dummy.json').then((res)=>res.json()).then((result)=>{
    result.map((res)=>{
        service = new google.maps.places.PlacesService(map);
        var request={
               placeid:res.title,
               fields:['address_components', 'business_status', 'name', 'opening_hours', 'photos', 'rating', 'reviews', 'url', 'vicinity']
        };
        service.getdetails(request,callback);
        function callback(result,status){
            if(status == google.maps.places.PlacesServiceStatus.OK){
                var marker=new google.maps.Marker({
                    map:map,
                    position:place.geometry.location
                })

                var InfoWindow=new google.maps.InfoWindow();
                google.maps.event.addListerner(marker,'click',function(){
                    InfoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    'Place ID: ' + place.place_id + '<br>' +
                    place.formatted_address + '</div>')
                    InfoWindow.open(map,this)
                })
            }
        }
    })
   });
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
