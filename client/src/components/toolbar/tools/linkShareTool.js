import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import copy from 'copy-to-clipboard';
import React, {
  useState,
} from 'react';
import {
  useRouteMatch,
} from 'react-router-dom';
import LinkIcon from '../../../resources/consistentsvg/share.svg';
import '../../../styles/shareLinkBox.css';

const ShareLinkBox = ({
  text,
  showSuccessToast,
}) => {
  const {
    canvasId: whiteboardId,
  } = useRouteMatch('/boards/:canvasId').params;
  const baseurl = `${process.env.REACT_APP_BASE_URL}/boards/`;
  const [
    isPopupVisible,
    setIsPopupVisible,
  ] = useState(false);

  function copyLink () {
    const copyText = document.querySelector('#value');
    copy(copyText.value);
  }

  function hidePopup () {
    setIsPopupVisible(false);
  }

  function showPopup () {
    setIsPopupVisible(true);
  }

  return (
    <div>
      <img alt='Get Share Link' draggable={false} onClick={showPopup} src={LinkIcon} />
      <Dialog aria-labelledby='form-dialog-title' onClose={hidePopup} open={isPopupVisible}>
        <DialogTitle id='form-dialog-title'>Share With Your Friends!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
          <TextField
            disabled
            fullWidth
            id='value'
            margin='dense'
            type='text'
            value={baseurl + whiteboardId}
          />

        </DialogContent>
        <DialogActions>
          <Button
            color='primary' onClick={() => {
              copyLink();
              hidePopup();
              showSuccessToast();
            }}
          >
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShareLinkBox;
