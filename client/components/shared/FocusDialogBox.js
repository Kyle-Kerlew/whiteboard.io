import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';
import React, {useState,} from 'react';

const FocusDialogBox = ({
  text,
  children,
  onSubmit,
  buttonText,
  isValid,
}) => {
  const [
    isPopupVisible,
    setIsPopupVisible,
  ] = useState(true);

  function hidePopup () {
    if (isValid) {
      setIsPopupVisible(false);
    }
  }

  return (
    <Dialog aria-labelledby='form-dialog-title' onClose={hidePopup} open={isPopupVisible}>
      <DialogTitle id='form-dialog-title'>Join As Guest</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
        <form onSubmit={onSubmit}>
          {children}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          color='primary' onClick={() => {
            if (isValid) {
              hidePopup();
            }

            onSubmit();
          }} type='submit'
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FocusDialogBox;
