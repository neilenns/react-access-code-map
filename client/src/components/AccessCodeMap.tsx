import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import LocateControl from "./LocateControl";
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
  const [map, setMap] = useState<L.Map | null>(null);

  const storeMapRef = (ref: L.Map | null) => {
    if (ref) {
      setMap(ref);
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
        setView="always"
        autoStart
        // Issue 101: High accuracy causes the dot to jump around too much when using on a mobile
        // device so disable it. Leaving the code here with it as false so in the future I remember
        // how to turn it on if I want to.
        locateOptions={{
          enableHighAccuracy: false,
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
