// This method of making custom markers is a combination of
// https://stackoverflow.com/a/65749459/9206264 and images from
// https://github.com/pointhi/leaflet-color-markers/tree/master/img
import L from "leaflet";

export const YellowMarker = new L.Icon({
  iconUrl: "/marker-icon-gold.png",
  iconRetinaUrl: "/marker-icon-2x-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const BlueMarker = new L.Icon({
  iconUrl: "/marker-icon-blue.png",
  iconRetinaUrl: "/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
