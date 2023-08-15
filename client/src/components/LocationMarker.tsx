import { Marker, Popup } from "react-leaflet";
import ILocation from "../interfaces/ILocation.mjs";
import { Typography, Box, IconButton, styled } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IUser } from "../interfaces/IUser.mjs";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { YellowMarker, BlueMarker } from "./CustomMarkers";

export type MarkerEventHandler = (location: ILocation) => void;

export interface ILocationMarkerProps {
  location: ILocation;
  onRemoveMarker: MarkerEventHandler;
  onEditMarker: MarkerEventHandler;
}

// Used to maintain line breaks in multi-line text when displaying it in a dialog
// Comes from https://stackoverflow.com/a/57392914/9206264, but turned in to a
// styled component to avoid inline CSS linting errors.
const MultiLineText = styled("div")(({}) => ({
  whiteSpace: "pre-wrap",
}));

export default function LocationMarkers({
  location,
  onEditMarker,
  onRemoveMarker,
}: ILocationMarkerProps) {
  const [userContext] = useContext(UserContext);

  const onMarkerEdit = () => {
    onEditMarker(location);
  };

  const onMarkerDelete = () => {
    onRemoveMarker(location);
  };

  return (
    <Marker
      position={[location.latitude!, location.longitude!]}
      key={location._id!.toString()}
      icon={location.hasToilet ? YellowMarker : BlueMarker}
    >
      <Popup>
        <Box aria-labelledby="marker-title">
          <Typography id="marker-title" variant="subtitle2">
            {location.title}
          </Typography>
          <Typography variant="body2">
            <MultiLineText>{location.note}</MultiLineText>
          </Typography>
          <Typography variant="caption">
            <i>
              Last modified by{" "}
              {(location.modifiedBy as IUser)?.firstName ?? "unknown"} on{" "}
              {location.lastModified?.toISOString().slice(0, 10) ?? "unknown"}
            </i>
          </Typography>
          {(userContext.details?.canEdit || userContext.details?.canDelete) && (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              {userContext.details?.canEdit && (
                <IconButton onClick={onMarkerEdit}>
                  <EditIcon />
                </IconButton>
              )}
              {userContext.details?.canDelete && (
                <IconButton onClick={onMarkerDelete}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Popup>
    </Marker>
  );
}
