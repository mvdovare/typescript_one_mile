import * as turf from '@turf/turf';
import { geojsonToWKT } from '@terraformer/wkt';
import './style.css';
import { saveAs } from 'file-saver';
import { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import L = require('leaflet');

const multipolygonContainer: HTMLElement = document.getElementById(
  'multipolygonContainer'
);
const geojsonContainer: HTMLElement =
  document.getElementById('geojsonContainer');
const save_button: HTMLElement = document.getElementById('save_button');

const fname = document.getElementById('fname') as HTMLInputElement;

const fname_value = fname?.value;
console.log(fname_value); // 👉️ "Initial value"

if (fname_value != null) {
  console.log(fname.value); // 👉️ "Initial value"
}

let coord_string = '';
fname?.addEventListener('input', function (event) {
  const target = event.target as HTMLInputElement;
  coord_string = target.value;
  console.log(coord_string);
  var lat_c: number = parseFloat(coord_string.split(',')[0]);
  var lon_c: number = parseFloat(coord_string.split(',')[0]);
  console.log(lat_c), lon_c;
});

// PASTE YOU COORDINATES, RADIUS and STEPS HERE
const latlon_input: LatLngExpression = [30.520699, -81.959603];
const radius_input = 1;
const steps = 100;

const input = {
  lngLat: [latlon_input[1], latlon_input[0]],
  radius: radius_input,
};
const options = { steps: steps, units: 'miles' };

const circle = turf.circle(input.lngLat, input.radius, options);
const geojson: GeoJSON.FeatureCollection<any> = {
  type: 'FeatureCollection',
  features: [circle],
};
const wkt: string = geojsonToWKT(geojson.features[0].geometry);
const multipolygon = wkt
  .replace('POLYGON ((', 'MULTIPOLYGON (((')
  .replace('))', ')))');

multipolygonContainer.innerHTML = multipolygon;
geojsonContainer.innerHTML = JSON.stringify(geojson);

save_button.onclick = () => {
  const filename = window.prompt('Please enter filename!');
  const blob = new Blob([multipolygon], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.wkt`);
};

var map = L.map('map').setView(latlon_input, 17);

// console.log(JSON.stringify(geojson));
L.geoJSON(geojson).addTo(map);
L.marker(latlon_input).addTo(map);

// var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
// topoMap.addTo(map);

var sat = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}');
sat.addTo(map);
