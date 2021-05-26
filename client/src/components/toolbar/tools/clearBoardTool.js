import React from 'react';
import CrossIcon from "../../../resources/svg/cross-icon.svg";

function ClearBoardTool({clearBoard, width = "36px", height = "36px"}) {
    function handleOnClick() {
        clearBoard(true);
    }

    return (
        <div>
            <img width={width} height={height} onClick={handleOnClick} src={CrossIcon} alt={"Clear Board"}/>
        </div>
    )
}

export default ClearBoardTool;