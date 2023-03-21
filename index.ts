import * as turf from '@turf/turf';
import { geojsonToWKT } from '@terraformer/wkt';
import './style.css';
import { saveAs } from 'file-saver';
import L = require('leaflet');

const latLngInput = document.getElementById('latLngInput');
const radiusInput = document.getElementById('radiusInput');
const refreshButton = document.getElementById('refreshButton');
const multipolygonContainer: HTMLElement = document.getElementById(
  'multipolygonContainer'
);
const geojsonContainer: HTMLElement =
  document.getElementById('geojsonContainer');
const save_button: HTMLElement = document.getElementById('save_button');

refreshButton.onclick = () => draw();

let map = L.map('map');
let geojsonCircle: L.GeoJSON<any>;
let circleMarker: L.Marker<any>;

function draw(): void {
  const latLngFromInput = (latLngInput as HTMLInputElement).value;
  const [latString, lngString] = latLngFromInput.split(',');
  const lat = +latString?.trim();
  const lng = +lngString?.trim();

  const radius = +(radiusInput as HTMLInputElement).value;

  //38.631312109301305, -90.21014776165008

  if (lat && lng && radius) {
    // PASTE YOU COORDINATES, RADIUS and STEPS HERE
    const steps = 100;

    const input = {
      lngLat: [lng, lat],
      radius,
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
    geojsonContainer.innerHTML = JSON.stringify(
      geojson['features'][0]['geometry']['coordinates'][0]
    );

    save_button.onclick = () => {
      const filename = window.prompt('Please enter filename!');
      const blob = new Blob([multipolygon], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, `${filename}.wkt`);
    };

    map.setView([lat, lng], 17);

    if (geojsonCircle && map.hasLayer(geojsonCircle)) {
      map.removeLayer(geojsonCircle);
    }

    if (circleMarker && map.hasLayer(circleMarker)) {
      map.removeLayer(circleMarker);
    }

    geojsonCircle = L.geoJSON(geojson);
    geojsonCircle.addTo(map);

    circleMarker = L.marker([lat, lng]);
    circleMarker.addTo(map);

    // var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    // topoMap.addTo(map);

    var sat = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}');
    sat.addTo(map);
  } else {
    multipolygonContainer.innerHTML = null;
    geojsonContainer.innerHTML = null;
    if (map.hasLayer(geojsonCircle)) {
      map.removeLayer(geojsonCircle);
    }
    if (map.hasLayer(circleMarker)) {
      map.removeLayer(circleMarker);
    }
  }
}
