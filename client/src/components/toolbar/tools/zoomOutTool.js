import React from 'react';
import ZoomOutIcon from "../../../resources/svg/zoom-out-icon.svg";

function ZoomOutTool({zoomOut, width = "36px", height = "36px"}) {
    return (
        <div>
            <img width={width} height={height} onClick={zoomOut} src={ZoomOutIcon} alt={"Zoom Out"}/>
        </div>
    )
}

export default ZoomOutTool;