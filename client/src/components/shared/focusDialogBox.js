import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import React, {useState} from 'react';
import Button from "@material-ui/core/Button";

function FocusDialogBox({text, children, onSubmit, buttonText, isValid}) {
    const [isPopupVisible, setIsPopupVisible] = useState(true);

    function hidePopup() {
        if (isValid) {
            setIsPopupVisible(false);
        }
    }

    return (
        <Dialog open={isPopupVisible} onClose={hidePopup} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Join As Guest</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {text}
                </DialogContentText>
                <form onSubmit={onSubmit}>
                    {children}
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="submit" onClick={() => {
                    if (isValid) {
                        hidePopup();
                    }
                    onSubmit();
                }} color="primary">
                    {buttonText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FocusDialogBox;