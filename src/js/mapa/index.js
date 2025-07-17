import { Dropdown } from "bootstrap";
import L from 'leaflet';

const map = L.map('map').setView([14.6349, -90.5069], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.marker([14.575344, -90.533613], {icon: redIcon}).addTo(map)
    .bindPopup('Brigada de Comunicaciones')
    .openPopup();