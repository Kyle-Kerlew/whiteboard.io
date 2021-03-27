import React from 'react';
import '../../styles/shareLinkBox.css';

function ShareLinkBox({text, whiteboardId, setIsVisible}) {

    const baseurl = "http://localhost:3000/";

    function copyLink() {
        //todo: automatically copy link into users browser & tell user we've done so
    }

    return (
        <div className={"container"}>
            <div className={"box"}>
                <p>{text}</p>
                <p className={"highlight"}>{baseurl + whiteboardId}</p>
                <button onClick={copyLink}>Copy Link</button>
                <button onClick={() => setIsVisible(false)}>Done</button>
            </div>
        </div>
    )
}

export default ShareLinkBox;