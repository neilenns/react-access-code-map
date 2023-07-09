import { createControlComponent } from "@react-leaflet/core";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// This code is based on https://stackoverflow.com/a/75567918.
// Accessing the control is from https://github.com/perliedman/leaflet-control-geocoder/issues/260#issuecomment-1272343753
interface P extends L.ControlOptions {}

function createGeocodeInstance(props: P) {
  // Unfortunate to have to add this ignore but otherwise typescript doesn't like the control.
  // I found a sample on the leaflet-geosearch page that did this too so I guess
  // that's how it has to be done.
  // @ts-ignore
  const instance = new GeoSearchControl({
    provider: new OpenStreetMapProvider({
      params: {
        countrycodes: "us",
      },
    }),
    style: "bar",
    showMarker: true,
    autoClose: true,
    keepResult: true,
    ...props,
  });

  return instance;
}

export const GeocodeControl = createControlComponent(createGeocodeInstance);
