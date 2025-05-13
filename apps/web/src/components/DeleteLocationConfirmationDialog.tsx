import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

export default function ConfirmationDialog(
  props: ConfirmationDialogProps
): JSX.Element {
  const { open, onClose } = props;
  const [, setConfirmed] = useState(false);

  function handleConfirm(): void {
    setConfirmed(true);
    onClose(true);
  }

  function handleCancel(): void {
    setConfirmed(false);
    onClose(false);
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this location?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
