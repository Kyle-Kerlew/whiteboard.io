import React from 'react';
import './toolbar.css';

const Toolbar = () => {
    return (
        <div className="toolbar">
            <ul>
                <li>
                    <svg height="25" width="25">
                        <circle cx="12.5" cy="12.5" r="2.5" stroke="black" stroke-width="3" fill="black"/>
                    </svg>
                </li>
                <li>
                    <svg height="50" width="50">
                        <circle cx="25" cy="25" r="15" stroke="black" stroke-width="3" fill="black"/>
                    </svg>
                </li>
                <li>
                    <svg height="75" width="75">
                        <circle cx="37.5" cy="37.5" r="27.5" stroke="black" stroke-width="3" fill="black"/>
                    </svg>
                </li>
            </ul>
        </div>
    )
}

export default Toolbar;