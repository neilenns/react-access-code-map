import { MapContainer, TileLayer } from "react-leaflet";
import { LocateControl } from "./LocateControl";
import { GeocodeControl } from "./GeocodeControl";
import LocationMarkers from "./LocationMarkers";
import Control from "react-leaflet-custom-control";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import * as L from "leaflet";
import { useState } from "react";

export interface IAccessCodeMapProps {
  onSignOutClick: React.MouseEventHandler;
}

export default function AccessCodeMap(props: IAccessCodeMapProps) {
  const { onSignOutClick } = props;
  const [autoLocate] = useState(true);

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

  return (
    <MapContainer
      center={[47.65496185820956, -122.25201847353225]}
      zoom={11}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeocodeControl />
      <LocateControl
        position="topright"
        ref={handleRef}
        options={{
          setView: "always",
          locateOptions: {
            enableHighAccuracy: true,
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
