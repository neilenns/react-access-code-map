import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import { LocateControl } from "./LocateControl";
import { GeocodeControl } from "./GeocodeControl";
import LocationMarkers from "./LocationMarkers";
import Control from "react-leaflet-custom-control";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import * as L from "leaflet";
import { useEffect, useState } from "react";

export interface IAccessCodeMapProps {
  onSignOutClick: React.MouseEventHandler;
}

export default function AccessCodeMap(props: IAccessCodeMapProps) {
  const { onSignOutClick } = props;
  const [autoLocate] = useState(() => {
    const storedValue = sessionStorage.getItem("autoLocate");
    if (!storedValue) {
      return true;
    } else {
      return sessionStorage.getItem("autoLocate") === "true";
    }
  });
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    sessionStorage.setItem("autoLocate", autoLocate.toString());
  }, [autoLocate]);

  // Getting this type definition right was a *pain*. I kept getting errors about MutableRefObject
  // type not matching. Fix is from here: https://stackoverflow.com/a/58033283. The key is to specify
  // both null as a valid type and null as the default. Otherwise an "undefined" sneaks in and the type
  // won't match.
  //
  // Also using useEffect() for this doesn't work since the ref may not be set yet. The only
  // way to make it work was to use the event handler method described here:
  // https://stackoverflow.com/a/55248699. What an adventure.
  const handleRef = (ref: L.Control.Locate | null) => {
    if (autoLocate && ref) {
      ref.start();
    }
  };

  const storeMapRef = (ref: L.Map | null) => {
    if (ref) {
      setMap(ref);

      // Add listeners for the locateactivate and locatedeactivate events so we can
      // persist the setting in storage and restore it when the map is reloaded.
      // I'd normally use useMapEvents() for this but it isn't accessible at any
      // level other than *inside* the MapContainer.
      map?.addEventListener("locateactivate", (_e) => {
        sessionStorage.setItem("autoLocate", "true");
      });
      map?.addEventListener("locatedeactivate", (_e) => {
        sessionStorage.setItem("autoLocate", "false");
      });
    }
  };

  // Hide the zoom control on mobile devices. Code from
  // https://gis.stackexchange.com/a/259718.
  useEffect(() => {
    if (L.Browser.mobile && map) {
      map.removeControl(map?.zoomControl);
    }
  }, [map]);

  return (
    <MapContainer
      center={[47.65496185820956, -122.25201847353225]}
      zoom={11}
      scrollWheelZoom={true}
      ref={storeMapRef}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Roads">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution='Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
            url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <GeocodeControl />
      <LocateControl
        position="topright"
        ref={handleRef}
        options={{
          setView: "always",
          // Issue 101: High accuracy causes the dot to jump around too much when using on a mobile
          // device so disable it. Leaving the code here with it as false so in the future I remember
          // how to turn it on if I want to.
          locateOptions: {
            enableHighAccuracy: false,
          },
        }}
      />
      <LocationMarkers />
      <Control position="bottomleft">
        <ButtonGroup orientation="vertical" variant="contained">
          <Tooltip placement="right" title="Sign Out">
            <Button color="inherit" onClick={onSignOutClick}>
              <ExitToApp />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Control>
    </MapContainer>
  );
}
