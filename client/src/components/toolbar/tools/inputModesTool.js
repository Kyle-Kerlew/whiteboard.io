import React, {useRef, useState} from 'react';
import MarkerIcon from "../../../resources/svg/marker-icon.svg";
import PresentationIcon from "../../../resources/svg/presentation-icon.svg";
import {Menu, MenuItem, MenuList} from "@material-ui/core";

function InputModesTool({handlePresentationClick, handleMarkerClick, anchorEl}) {
    const [isPresentationMenuVisible, setIsPresentationMenuVisible] = useState(false);
    const [istMarkerMenuVisible, setMarkerMenuVisible] = useState(false);
    const [mode, setMode] = useState("Drawing");
    const presentationModeMenuAnchorRef = useRef();
    const markerMenuAnchorRef = useRef();

    return (
        <div>
            <Menu anchorEl={document.getElementsByClassName('toolbar')[0]} open={istMarkerMenuVisible}
                  onClose={() => setMarkerMenuVisible(false)}>
                {['small', 'medium', 'large'].map(size => <MenuItem>{size}</MenuItem>)}
            </Menu>
            <img
                ref={markerMenuAnchorRef}
                onClick={() => setMarkerMenuVisible(true)}
                src={MarkerIcon}
                alt={"Marker Options"}
            />
        </div>
    )
}

export default InputModesTool;