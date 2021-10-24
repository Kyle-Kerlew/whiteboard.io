import React from 'react';
import ZoomInIcon from "../../../resources/svg/zoom-in-icon.svg";

function ZoomInTool({zoomIn}) {
    return (
        <div>
            <img onClick={zoomIn} src={ZoomInIcon} alt={"Zoom In"}/>
        </div>
    )
}

export default ZoomInTool;