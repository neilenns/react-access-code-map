import {
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { LocateControl } from "./LocateControl";
import { GeocodeControl } from "./GeocodeControl";
import LocationMarkers from "./LocationMarkers";
import Control from "react-leaflet-custom-control";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import * as L from "leaflet";
import { useContext, useEffect, useState } from "react";
import ILocation from "../interfaces/ILocation.mts";
import { getLocations } from "../markerApi";
import { UserContext } from "../context/UserContext";

export interface IAccessCodeMapProps {
  onSignOutClick: React.MouseEventHandler;
}

export default function AccessCodeMap(props: IAccessCodeMapProps) {
  const [locations, setLocations] = useState<ILocation[]>([]);
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
  const [userContext] = useContext(UserContext);

  /**
   * Adds a marker to the map.
   * @param {ILocation} location - The location object representing the marker to be added.
   * @returns {void} Returns nothing.
   * @group Marker Management
   */
  function addMarkerToMap(location: ILocation): void {
    setLocations((prevValue) => [...prevValue, location]);
  }

  /**
   * Removes a marker from the map.
   * @param {Types.ObjectId} _id - The ID of the marker to be removed.
   * @returns {void} Returns nothing.
   * @group Marker Management
   */
  function removeMarkerFromMap(marker: ILocation): void {
    setLocations((prevValue) =>
      prevValue.filter((location) => location._id !== marker._id!)
    );
  }

  function handleAddMarker(location: ILocation): void {
    addMarkerToMap(location);
  }

  function handleEditMarker(
    location: ILocation,
    updatedLocation: ILocation
  ): void {
    removeMarkerFromMap(location);
    addMarkerToMap(updatedLocation);
  }

  function handleDeleteMarker(location: ILocation): void {
    removeMarkerFromMap(location);
  }

  // Gets the locations from the database when the component is mounted.
  useEffect(() => {
    getLocations(userContext.token)
      .then((locations) => {
        setLocations(locations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userContext.token]);

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
        <LayersControl.Overlay checked name="Access codes">
          <LayerGroup>
            <LocationMarkers
              locations={locations.filter((location) => location.hasCodes)}
              onAddMarker={handleAddMarker}
              onEditMarker={handleEditMarker}
              onDeleteMarker={handleDeleteMarker}
            />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Toilets">
          <LayerGroup>
            <LocationMarkers
              locations={locations.filter(
                (location) => !location.hasCodes && location.hasToilet
              )}
              onAddMarker={handleAddMarker}
              onEditMarker={handleEditMarker}
              onDeleteMarker={handleDeleteMarker}
            />
          </LayerGroup>
        </LayersControl.Overlay>
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
