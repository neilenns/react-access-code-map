import { createControlComponent } from "@react-leaflet/core";
import * as L from "leaflet";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";

// This code comes directly from https://stackoverflow.com/a/75567918
interface P extends L.ControlOptions {
  position?: L.ControlPosition;
  options?: L.Control.LocateOptions;
}

const { Locate } = L.Control;

function createLocateInstance(props: P) {
  const instance = new Locate({
    position: props.position,
    initialZoomLevel: 16,
    keepCurrentZoomLevel: true,
    showPopup: false,
    ...props.options,
    //    ...props,
  });

  return instance;
}

export const LocateControl = createControlComponent(createLocateInstance);
