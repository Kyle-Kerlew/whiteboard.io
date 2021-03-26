import React from 'react';
import '../../styles/sidetoolbar.css';

const SideToolbar = props => {
    return (
        <div className="sidetoolbar">
            <ul>
                <li>
                    <svg onClick={() => props.setColor("black")} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="black" strokeWidth="3" fill="black"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setColor("red")} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="red" strokeWidth="3" fill="red"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setColor("blue")} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="blue" strokeWidth="3" fill="blue"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setColor("cyan")} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="cyan" strokeWidth="3" fill="cyan"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setColor("yellow")} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="yellow" strokeWidth="3" fill="yellow"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setColor("green")} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="green" strokeWidth="3" fill="green"/>
                    </svg>
                </li>
            </ul>
        </div>
    )
}

export default SideToolbar;