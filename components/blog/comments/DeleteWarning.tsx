import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
export default function DeleteWarning({
  onCancel,
  onDelete,
  showDeleteWarning,
}: {
  onCancel: () => void;
  onDelete: () => void;
  showDeleteWarning: boolean;
}) {
  return (
    <Dialog open={showDeleteWarning} onClose={onCancel}>
      <DialogTitle>Delete Comment</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this comment? All of your data will be
        permanently removed. This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='primary'>
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          color='primary'
          variant='contained'
          style={{ backgroundColor: "red" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
