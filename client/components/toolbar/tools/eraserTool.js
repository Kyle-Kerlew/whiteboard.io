import React from 'react';
import EraserIcon from "../../../public/resources/svg/eraser-icon.svg";

function EraserTool({setIsErasing}) {

    function handleClick() {
        setIsErasing(true);
    }

    return (
        <div>
            <Image priority={true}onClick={handleClick} src={EraserIcon} alt={"Eraser"}/>
        </div>
    )
}

export default EraserTool;
