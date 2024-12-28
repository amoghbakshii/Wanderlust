mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates,  // Default coordinates
    zoom: 11,
});

console.log(coordinates);

const marker1 = new mapboxgl.Marker({color:"Red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset :25})
        .setHTML("<h5>Exact location will be provided later</h5>"))
        .addTo(map);