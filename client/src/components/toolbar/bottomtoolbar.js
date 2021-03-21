import React from 'react';
import './bottomtoolbar.css';

const BottomToolbar = props => {
    return (
        <div className="bottomtoolbar">
            <ul>
                <li>
                    <svg onClick={() => props.setPaintSize(5)} height="25" width="25">
                        <circle cx="12.5" cy="12.5" r="2.5" stroke="black" strokeWidth="3" fill="black"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setPaintSize(30)} height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="black" strokeWidth="3" fill="black"/>
                    </svg>
                </li>
                <li>
                    <svg onClick={() => props.setPaintSize(55)} height="75" width="75">
                        <circle cx="37.5" cy="37.5" r="27.5" stroke="black" strokeWidth="3" fill="black"/>
                    </svg>
                </li>
            </ul>
        </div>
    )
}

export default BottomToolbar;