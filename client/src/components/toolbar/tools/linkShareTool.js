import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import copy from 'copy-to-clipboard';
import React, {useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import LinkIcon from '../../../resources/svg/link-icon.svg';
import '../../../styles/shareLinkBox.css';

function ShareLinkBox({text, showSuccessToast}) {
    const {canvasId: whiteboardId} = useRouteMatch('/:canvasId').params;
    const baseurl = `${process.env.REACT_APP_BASE_URL}/`;
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    function copyLink() {
        const copyText = document.getElementById("value");
        copy(copyText.value);
    }

    function hidePopup() {
        setIsPopupVisible(false);
    }

    function showPopup() {
        setIsPopupVisible(true);
    }

    return (
        <div>
            <img onClick={showPopup} src={LinkIcon} alt="Get Share Link"/>
            <Dialog open={isPopupVisible} onClose={hidePopup} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Share With Your Friends!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        type="text"
                        id={"value"}
                        fullWidth
                        disabled
                        value={baseurl + whiteboardId}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        copyLink();
                        hidePopup();
                        showSuccessToast();
                    }} color="primary">
                        Copy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ShareLinkBox;
