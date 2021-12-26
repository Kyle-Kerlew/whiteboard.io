import React, {useState} from 'react';
import {Menu, MenuItem, Select} from "@material-ui/core";
import Square from "../../../resources/svg/square.svg";

const SHAPES = Object.freeze({
    SQUARE: 'square'
});

const ShapeTool = ({handleChange}) => {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    return (
        <div onClick={() => setIsMenuVisible(true)} style={{width: '50px', height: '50px', backgroundColor: 'black'}}>
            <Menu open={isMenuVisible}
                  onClose={() => setIsMenuVisible(false)}>
                {Object.values(SHAPES).map(shape => {
                    return (
                        <MenuItem onClick={e => handleChange(shape)}><img src={Square} alt={shape}/></MenuItem>
                    )
                })
                }
            </Menu>
        </div>
    )
}

export default ShapeTool;