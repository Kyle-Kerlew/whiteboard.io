import React from 'react';
import ZoomOutIcon from "../../../resources/svg/zoom-out-icon.svg";

function ZoomOutTool({zoomOut}) {
    return (
        <div>
            <img onClick={zoomOut} src={ZoomOutIcon} alt={"Zoom Out"}/>
        </div>
    )
}

export default ZoomOutTool;