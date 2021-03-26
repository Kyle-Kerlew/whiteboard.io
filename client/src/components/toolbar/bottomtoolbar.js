import React, {useState} from 'react';
import '../../styles/bottomtoolbar.css';
import CrossIcon from '../../resources/svg/cross-icon.svg'
import LinkIcon from '../../resources/svg/link-icon.svg'

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
                <div className={"divider"}/>
                <li>
                    <img width="24px" height="24px" onClick={props.clearBoard} src={CrossIcon} alt={"Clear Board"}/>
                </li>
                <li>
                    <img width="24px" height="24px" onClick={() => props.setIsPopupVisible(true)} src={LinkIcon} alt="Get Share Link"/>
                </li>
            </ul>
        </div>
    )
}

export default BottomToolbar;