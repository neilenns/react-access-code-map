import { Marker, Popup } from "react-leaflet";
import ILocation from "../interfaces/ILocation.mjs";
import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Types } from "mongoose";
import { Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export type RemoveMarkerHandler = (_id: Types.ObjectId) => void;

export interface ILocationMarkerProps {
  location: ILocation;
  onRemoveMarker: RemoveMarkerHandler;
}

export default function LocationMarkers(props: ILocationMarkerProps) {
  const { location, onRemoveMarker } = props;
  const [userContext] = useContext(UserContext);

  const onMarkerEdit = () => {
    console.log(`Editing ${location._id}`);
  };

  const onMarkerDelete = () => {
    axios
      .delete(new URL(`locations/${location._id}`, serverUrl).toString(), {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      })
      .then(() => {
        console.log(`Successfully deleted ${location._id} from the database`);
        onRemoveMarker(location._id);
      })
      .catch((err) => {
        console.log(
          `Unable to delete ${location._id} from the database: ${err}`
        );
      });
  };

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      key={location._id.toString()}
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
              Last modified by {location.modifiedByFirstName} on{" "}
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
