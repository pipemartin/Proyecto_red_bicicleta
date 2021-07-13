var mymap = L.map('main-map').setView([2.923696, -75.286909], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
}).addTo(mymap);

/* L.marker([2.923803, -75.286741]).bindPopup('This is my home, CO.').addTo(mymap),
L.marker([2.926416,  -75.279879]).bindPopup('This is My highschool, CO.').addTo(mymap),
L.marker([2.926409, -75.289152]).bindPopup('This is park my city, CO.').addTo(mymap);
 */

$.ajax({
    dataType:"json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(mymap);
        });
    }
});