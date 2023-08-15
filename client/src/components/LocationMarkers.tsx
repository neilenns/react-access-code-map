import axios from "axios";
import { LatLng, LeafletMouseEvent } from "leaflet";
import React, { useContext } from "react";
import { useMapEvent } from "react-leaflet";
import { UserContext } from "../context/UserContext";
import ILocation from "../interfaces/ILocation.mjs";
import INominatimReverseResponse from "../interfaces/INominatimReverseResponse.mjs";
import { addLocation, removeLocation, updateLocation } from "../markerApi";
import LocationMarker, { MarkerEventHandler } from "./LocationMarker";
import { MarkerEditDialog } from "./MarkerEditDialog";
import ConfirmationDialog from "./DeleteLocationConfirmationDialog";

export interface ILocationMarkerProps {
  locations: ILocation[];
  onDeleteMarker: MarkerEventHandler;
  onEditMarker: (location: ILocation, updatedLocation: ILocation) => void;
  onAddMarker: MarkerEventHandler;
}

export default function LocationMarkers({
  locations,
  onDeleteMarker,
  onEditMarker,
  onAddMarker,
}: ILocationMarkerProps) {
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    React.useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = React.useState<ILocation>({});
  const [userContext] = useContext(UserContext);

  /**
   * Helper function to reverse geocode a map location.
   * @param latlng - The latitude and longitude of the location to be reverse geocoded.
   * @returns {Promise<INominatimReverseResponse | null>} A promise that resolves to the reverse geocoded location.
   */
  async function reverseGeocode(
    latlng: LatLng
  ): Promise<INominatimReverseResponse | null> {
    return axios
      .get<INominatimReverseResponse>(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error during reverse geocoding:", error);
        return null;
      });
  }

  /**
   * Handles the edit action for a marker. Opens the edit dialog with the marker's data.
   * @param {Types.ObjectId} _id - The ID of the marker to be edited.
   * @returns {void} Returns nothing.
   * @group Event Handlers
   */
  function handleEditMarker(marker: ILocation): void {
    const location = locations.find((location) => location._id === marker._id!);

    if (location) {
      setSelectedLocation(location);
      setIsEdit(true);
      setIsEditOpen(true);
    }
  }

  /**
   * Handles the removal of a marker. Removes the marker from the map and the database.
   * @param _id - The ID of the marker to be removed.
   * @returns {void} Returns nothing.
   * @group Event Handlers
   */
  function handleDeleteMarker(marker: ILocation): void {
    const location = locations.find((location) => location._id === marker._id!);

    if (location) {
      setSelectedLocation(location);
      setIsDeleteConfirmOpen(true);
    }
  }

  function onDeleteConfirmClosed(confirmed: boolean) {
    if (!selectedLocation) return;

    setIsDeleteConfirmOpen(false);
    if (confirmed) {
      removeLocation(selectedLocation._id!, userContext.token)
        .then(() => {
          console.log(
            `Successfully removed ${selectedLocation._id} from the database`
          );
          onDeleteMarker(selectedLocation);
        })
        .catch((error) => {
          console.log(
            `Unable to remove ${selectedLocation._id} from the database: ${error}`
          );
        });
    }
  }

  /**
   * Handles the cancel action for the marker edit. Closes the edit dialog.
   * @returns {void} Returns nothing.
   * @group Event Handlers
   */
  function onMarkerEditCancel(): void {
    setIsEditOpen(false);
  }

  /**
   * Handles the save action for the marker edit. If the marker has an ID, it is updated. Otherwise, it is created.
   * @param location - The location object representing the marker to be saved.
   * @returns {void} Returns nothing.
   */
  function onMarkerEditSave(location: ILocation): void {
    if (location._id) {
      updateLocation(location, userContext.token)
        .then((updatedLocation) => {
          onEditMarker(location, updatedLocation);
        })
        .catch((err) => {
          console.log(`Unable to update location: ${err}`);
        })
        .finally(() => {
          setIsEditOpen(false);
        });
    } else {
      addLocation(location, userContext.token)
        .then((newLocation) => {
          onAddMarker(newLocation);
        })
        .catch((err) => {
          console.log(`Unable to create new marker: ${err}`);
        })
        .finally(() => {
          setIsEditOpen(false);
        });
    }
  }

  // Adds a marker to the map when the user clicks on the map.
  useMapEvent("contextmenu", async (e: LeafletMouseEvent) => {
    if (!userContext.details?.canCreate) {
      return;
    }

    const geoDetails = await reverseGeocode(e.latlng);

    const newLocation = {
      title: geoDetails
        ? `${
            geoDetails.address?.building
              ? geoDetails.address.building
              : `${geoDetails.address?.house_number ?? ""} ${
                  geoDetails.address?.road ?? ""
                }`.trim()
          }`
        : "",
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      note: "",
      hasToilet: false,
      hasCodes: true,
    };

    setSelectedLocation(newLocation);
    setIsEdit(false);
    setIsEditOpen(true);
  });

  return (
    <>
      {locations.map((location) => (
        <LocationMarker
          location={location}
          key={location._id!.toString()}
          onRemoveMarker={handleDeleteMarker}
          onEditMarker={handleEditMarker}
        />
      ))}
      <MarkerEditDialog
        isOpen={isEditOpen}
        isEdit={isEdit}
        location={selectedLocation}
        onSave={onMarkerEditSave}
        onCancel={onMarkerEditCancel}
      />
      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClosed}
      />
    </>
  );
}
