function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(54, -6.41),
        zoom: 18,
        mapId:'c3a03b34da8f8d5a'
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
   fetch('dummy.json').then((res)=>res.json()).then((result)=>{
    result.map((res)=>{
        const marker=new google.maps.Marker({
            map:map,
            position:new google.maps.LatLng(res.latitude,res.longitude),
            title:res.title,
            icon:{
                url:res.img,
                scalesSize:new google.maps.Size(25,25)
            },
            type:res.type
        })
    })
   });
}
