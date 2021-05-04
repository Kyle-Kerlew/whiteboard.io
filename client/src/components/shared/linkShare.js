import React, {useState} from 'react';
import '../../styles/shareLinkBox.css';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TextField
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import copy from "copy-to-clipboard";
import Alert from '@material-ui/lab/Alert';

function ShareLinkBox({text, whiteboardId, setIsVisible, showSuccessToast}) {
    const baseurl = `http://localhost:3000/`; //todo: not for prod
    const [open, setOpen] = useState(false);

    function copyLink() {
        const copyText = document.getElementById("value");
        copy(copyText.value);
        setOpen(true);
    }

    return (
        <Dialog open={true} onClose={() => setIsVisible(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Share With Your Friends</DialogTitle>
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
                    setIsVisible(false);
                    showSuccessToast();
                }} color="primary">
                    Copy
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShareLinkBox;