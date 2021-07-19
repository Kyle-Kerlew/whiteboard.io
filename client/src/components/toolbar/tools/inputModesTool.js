import React, {useRef, useState} from 'react';
import MarkerIcon from "../../../resources/svg/marker-icon.svg";
import PresentationIcon from "../../../resources/svg/presentation-icon.svg";
import {Menu, MenuItem, MenuList} from "@material-ui/core";

function InputModesTool({handlePresentationClick, handleMarkerClick, anchorEl, width = "36px", height = "36px"}) {
    const [isPresentationMenuVisible, setIsPresentationMenuVisible] = useState(false);
    const [istMarkerMenuVisible, setMarkerMenuVisible] = useState(false);
    const [mode, setMode] = useState("Drawing");
    const presentationModeMenuAnchorRef = useRef();
    const markerMenuAnchorRef = useRef();

    return (
        <div>
            <Menu anchorEl={document.getElementsByClassName('toolbar')[0]} open={isPresentationMenuVisible}
                  onClose={() => setIsPresentationMenuVisible(false)}>
                <MenuItem>{mode === "Presentation" ? "Presentation" : "Drawing"} </MenuItem>
            </Menu>
            <img width={width} height={height}
                 onClick={() => setIsPresentationMenuVisible(true)}
                 src={PresentationIcon}
                 alt={"Modes"}/>
            <Menu anchorEl={document.getElementsByClassName('toolbar')[0]} open={istMarkerMenuVisible}
                  onClose={() => setMarkerMenuVisible(false)}>
                {['small', 'medium', 'large'].map(size => <MenuItem>{size}</MenuItem>)}
            </Menu>
            <img ref={markerMenuAnchorRef} width={width} height={height} onClick={() => setMarkerMenuVisible(true)}
                 src={MarkerIcon}
                 alt={"Marker Options"}/>
        </div>
    )
}

export default InputModesTool;