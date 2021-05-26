import React from 'react';
import ZoomInIcon from "../../../resources/svg/zoom-in-icon.svg";

function ZoomInTool({zoomIn, width = "36px", height = "36px"}) {
    return (
        <div>
            <img width={width} height={height} onClick={zoomIn} src={ZoomInIcon} alt={"Zoom In"}/>
        </div>
    )
}

export default ZoomInTool;