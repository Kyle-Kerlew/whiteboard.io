import React from 'react';
import EraserIcon from "../../../resources/svg/eraser-icon.svg";

function EraserTool({setIsErasing, width = "36px", height = "36px"}) {

    function handleClick() {
        setIsErasing(true);
    }

    return (
        <div>
            <img width={width} height={height} onClick={handleClick} src={EraserIcon} alt={"Eraser"}/>
        </div>
    )
}

export default EraserTool;