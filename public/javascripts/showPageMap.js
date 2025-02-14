mapboxgl.accessToken = mapboxToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: parcao.geometry.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl())

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat(parcao.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({
    //         offset: 25
    //     })
    //     .setHTML(
    //         `<h2>${parcao.title}</h2><p>${parcao.location}`
    //     )
    // )
    .addTo(map)