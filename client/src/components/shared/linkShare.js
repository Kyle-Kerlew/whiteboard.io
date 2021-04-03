import React from 'react';
import '../../styles/shareLinkBox.css';
import {Button, TextField} from '@material-ui/core';
import onClickOutside from "react-onclickoutside";

function ShareLinkBox({text, whiteboardId, setIsVisible}) {

    const baseurl = "http://localhost:3000/";

    function copyLink() {
        const copyText = document.getElementById("value");
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand('copy');
    }

    ShareLinkBox.handleClickOutside = () => setIsVisible(false);
    return (
        <div className={"box"}>
            <div className="inline-copy">
                <TextField type={"text"} value={baseurl + whiteboardId} id={"value"}/>
                <Button onClick={copyLink} variant="contained">Copy</Button>
            </div>
            <p>{text}</p>
            <Button onClick={() => setIsVisible(false)} variant="contained">OK</Button>
        </div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => ShareLinkBox.handleClickOutside
}
export default onClickOutside(ShareLinkBox, clickOutsideConfig);