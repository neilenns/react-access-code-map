import { createControlComponent } from '@react-leaflet/core';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

import Geocoder from 'leaflet-control-geocoder'

// This code is based on https://stackoverflow.com/a/75567918.
// Accessing the control is from https://github.com/perliedman/leaflet-control-geocoder/issues/260#issuecomment-1272343753
interface P extends L.ControlOptions {}

function createGeocodeInstance(props: P) {
  const instance = new Geocoder(props);

  return instance;
}

export const GeocodeControl = createControlComponent(createGeocodeInstance);