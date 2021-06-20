import React from 'react';
import MarkerIcon from "../../../resources/svg/marker-icon.svg";

function MarkerOptionsTool({width = "36px", height = "36px"}) {
    function handleClick(e) {

    }
    return (
        <div>
            <img width={width} height={height} onClick={handleClick} src={MarkerIcon} alt={"Marker Options"}/>
        </div>
    )
}

export default MarkerOptionsTool;