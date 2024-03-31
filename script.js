function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(54, -6.41),
        zoom: 18,
        mapId:'c3a03b34da8f8d5a'
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const Marker_object=[
        {
        position:new google.maps.LatLng(54.01, -6.42),
        title:'King\'s college',
        icon:{
            url:'allicons/college.png',
            scaledSize:new google.maps.Size(25,25)
        }
        },
        {
           position:new google.maps.LatLng(54.02, -6.43),
           title:'Irish\'s Museum',
           icon:{
            url:'allicons/museum.png',
            scaledSize:new google.maps.Size(25,25)
           }
        },
        {
         position:new google.maps.LatLng(54.03, -6.44),
         title:'Pool Club',
         icon:{
               url:'allicons/poolclub.png',
               scaledSize:new google.maps.Size(25,25)
         }
        },
        {
            position:new google.maps.LatLng(54.04,-6.41),
            title:'Italian Restaurant',
            icon:{
                  url:'allicons/icons8-restaurant-50.png',
                  scaledSize:new google.maps.Size(25,25)
            }
        }

    ]
    
   

    for(let i=0;i<Marker_object.length;i++){
        const marker=new google.maps.Marker({
            map:map,
            position:Marker_object[i].position,
            title:Marker_object[i].title,
            icon:{
                url:Marker_object[i].icon.url,
                scaledSize:Marker_object[i].icon.scaledSize
            }
        })
    }
}
