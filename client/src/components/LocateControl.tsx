import * as L from "leaflet";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import { EffectCallback, useEffect, useState } from "react";
import { useMap } from "react-leaflet";

interface ILocateControlProps extends L.Control.LocateOptions {
  autoStart?: boolean;
}

const LocateControl = (props: ILocateControlProps) => {
  const { autoStart, ...rest } = props;
  const [savedAutoLocateState] = useState(() => {
    const storedValue = sessionStorage.getItem("autoLocate");
    if (!storedValue) {
      return true;
    } else {
      return sessionStorage.getItem("autoLocate") === "true";
    }
  });
  const map = useMap();

  // Add listeners for the locateactivate and locatedeactivate events so we can
  // persist the setting in storage and restore it when the map is reloaded.
  // I'd normally use useMapEvents() for this but it isn't accessible at any
  // level other than *inside* the MapContainer.
  map?.addEventListener("locateactivate", (e) => {
    sessionStorage.setItem("autoLocate", "true");
  });
  map?.addEventListener("locatedeactivate", (e) => {
    sessionStorage.setItem("autoLocate", "false");
  });

  useEffect((): ReturnType<EffectCallback> => {
    const instance = new L.Control.Locate({
      ...rest,
    });

    map.addControl(instance);

    return () => {
      map.removeControl(instance);
    };
  }, [map, rest]);

  return null;
};

export default LocateControl;
