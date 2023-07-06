import { Marker, Popup } from "react-leaflet";
import ILocation from "../interfaces/ILocation.mjs";
import { Types } from "mongoose";
import { Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IUser } from "../interfaces/IUser.mjs";

export type MarkerEventHandler = (_id: Types.ObjectId) => void;

export interface ILocationMarkerProps {
  location: ILocation;
  onRemoveMarker: MarkerEventHandler;
  onEditMarker: MarkerEventHandler;
}

export default function LocationMarkers(props: ILocationMarkerProps) {
  const { location, onEditMarker, onRemoveMarker } = props;

  const onMarkerEdit = () => {
    onEditMarker(location._id!);
  };

  const onMarkerDelete = () => {
    onRemoveMarker(location._id!);
  };

  return (
    <Marker
      position={[location.latitude!, location.longitude!]}
      key={location._id!.toString()}
    >
      <Popup>
        <Box>
          <Typography variant="h6" component="h1">
            {location.title}
          </Typography>
          <Typography variant="body2" component="p">
            {location.note}
          </Typography>
          <Typography variant="body2" component="p">
            <i>
              Last modified by {(location.modifiedBy as IUser)?.firstName} on{" "}
              {location.lastModified?.toISOString().slice(0, 10)}
            </i>
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <IconButton onClick={onMarkerEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onMarkerDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Popup>
    </Marker>
  );
}
