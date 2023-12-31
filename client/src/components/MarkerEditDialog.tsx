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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import styled from "@mui/system/styled";

interface IMarkerEditDialogProps {
  isOpen: boolean;
  location: ILocation;
  isEdit: boolean;
  onSave: (location: ILocation) => void;
  onCancel: () => void;
}

// This method of making a top-aligned styled MUI dialog comes from
// https://stackoverflow.com/a/73745188/9206264. Any other method that
// mention using makeStyles doesn't work with MUI v5 and React 18 or later.
const TopAlignedDialog = styled(Dialog)(({}) => ({
  "& .MuiDialog-container": {
    alignItems: "flex-start",
  },
}));

export const MarkerEditDialog: React.FC<IMarkerEditDialogProps> = (props) => {
  const [location, setLocation] = useState<ILocation>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    setLocation(props.location);
    setIsEdit(props.isEdit);
  }, [props.location, props.isEdit]);

  const onDialogSave: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    props.onSave({
      ...location,
      // Issue 102: Trim whitespace and remove newlines from title and note
      title: location.title?.trim().replace(/^\n+|\n+$/g, ""),
      note: location.note?.trim().replace(/^\n+|\n+$/g, ""),
    });
  };

  const onDialogClose: React.MouseEventHandler<HTMLButtonElement> = (
    _event
  ) => {
    props.onCancel();
  };

  const handleToiletCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocation({ ...location, hasToilet: event.target.checked });
  };

  return (
    // disableRestoreFocus is required due to a bug in MUI that prevents autoFocus
    // on the text field from working when React strict mode is enabled. See
    // https://github.com/mui/material-ui/issues/33004#issuecomment-1455260156
    <TopAlignedDialog
      open={props.isOpen}
      onClose={onDialogClose}
      disableRestoreFocus
      aria-labelledby="marker-edit-dialog-title"
    >
      <DialogTitle id="marker-edit-dialog-title">
        {isEdit ? "Edit" : "Add"} access code
      </DialogTitle>
      <DialogContent>
        <TextField
          defaultValue={props.location.title}
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocation({ ...location, title: e.target.value });
          }}
          // Since this field is often pre-populated with a value that needs
          // to be changed, auto-select the text when it is focused so the
          // user doesn't have to backspace everything.
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
            e.target.select();
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
          rows={3}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocation({ ...location, note: e.target.value });
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={location.hasToilet}
              onChange={handleToiletCheckboxChange}
              name="Domain"
            />
          }
          label="Has a toilet"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose}>Cancel</Button>
        <Button onClick={onDialogSave}>Save</Button>
      </DialogActions>
    </TopAlignedDialog>
  );
};
