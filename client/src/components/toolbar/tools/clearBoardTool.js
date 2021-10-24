import React from 'react';
import CrossIcon from "../../../resources/svg/cross-icon.svg";

function ClearBoardTool({clearBoard}) {
    function handleOnClick() {
        clearBoard(true);
    }

    return (
        <div>
            <img onClick={handleOnClick} src={CrossIcon} alt={"Clear Board"}/>
        </div>
    )
}

export default ClearBoardTool;