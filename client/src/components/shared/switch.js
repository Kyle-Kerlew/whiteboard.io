import React from 'react';
import "../../styles/switch.css";

function Switch() {

    return (
        <label className="switch">
            <input type="checkbox"/>
            <div className="slider round"/>
        </label>
    )
}

export default Switch;