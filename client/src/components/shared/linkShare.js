import React from 'react';
import '../../styles/shareLinkBox.css';

function ShareLinkBox({text, whiteboardId, setIsVisible}) {

    const baseurl = "http://localhost:3000/";

    function copyLink() {
        const copyText = document.getElementById("value");
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand('copy');
    }

    return (
        <div className={"container"}>
            <div className={"box"}>
                <input type={"text"} value={baseurl + whiteboardId} id={"value"}/>
                <p>{text}</p>
                <button onClick={copyLink}>Copy Link</button>
                <button onClick={() => setIsVisible(false)}>Done</button>
            </div>
        </div>
    )
}

export default ShareLinkBox;