import React from 'react';
import EraserIcon from "../../../resources/svg/eraser-icon.svg";

function EraserTool({setIsErasing}) {

    function handleClick() {
        setIsErasing(true);
    }

    return (
        <div>
            <img onClick={handleClick} src={EraserIcon} alt={"Eraser"}/>
        </div>
    )
}

export default EraserTool;