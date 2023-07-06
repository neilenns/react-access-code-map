// React component that takes in an ILocation as initial state,
// shows a MUI dialog with text fields for the ILocation title and note fields,
// then provides the updated ILocation to the parent component.

import React, { useEffect, useState } from "react";
import ILocation from "../interfaces/ILocation.mjs";
import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";

interface IMarkerEditDialogProps {
  isOpen: boolean;
  location: ILocation;
  onSave: (location: ILocation) => void;
  onCancel: () => void;
}

export const MarkerEditDialog: React.FC<IMarkerEditDialogProps> = (props) => {
  const [location, setLocation] = useState<ILocation>({});

  useEffect(() => {
    setLocation(props.location);
  }, [props.location]);

  const onDialogSave: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    props.onSave(location);
  };

  const onDialogClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    props.onCancel();
  };

  return (
    <Dialog open={props.isOpen} onClose={onDialogClose}>
      <DialogTitle>Add access code</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          defaultValue={props.location.title}
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocation({ ...location, title: e.target.value });
          }}
        />
        <TextField
          autoFocus
          defaultValue={props.location.note}
          margin="dense"
          id="note"
          label="Note"
          type="text"
          multiline
          rows={4}
          fullWidth
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocation({ ...location, note: e.target.value });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose}>Cancel</Button>
        <Button onClick={onDialogSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
