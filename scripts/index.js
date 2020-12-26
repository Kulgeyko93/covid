// import { App } from './components/App/App.js';

// new App();

// Creating map options
// let mapOptions = {
//    center: [53.7098, 27.9534],
//    zoom: 2
// }

// // Creating a map object
// // let map = L.map('sample').setView(new LatLng(53.7098, 27.9534), 13);


// let map = new L.map('sample', mapOptions);
// // Creating a Layer object
// let layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// // Adding layer to the map
// map.addLayer(layer);

// map.on((e) =>console.log(e))


// var map = new Datamap({element: document.getElementById('container')});


// let map = new Datamap({
//    scope: 'world',
//    element: document.getElementById('map-world'),
//    projection: 'mercator',
//    // height: 500,
//    fills: {
//       defaultFill: '#f0af0a',
//       lt50: 'rgba(0,244,244,0.9)',
//       gt50: 'red'
//    },
// })

var requestOptions = {
   method: 'GET',
   redirect: 'follow'
};
// ---------------------------------------------------------
import { App } from './components/App/App.js';

new App();

