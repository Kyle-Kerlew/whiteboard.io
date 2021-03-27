import React, {createRef, useEffect, useRef, useState} from 'react';
import '../../styles/bottomtoolbar.css';
import CrossIcon from '../../resources/svg/cross-icon.svg'
import LinkIcon from '../../resources/svg/link-icon.svg'

const BottomToolbar = props => {

    const [isActive, setIsActive] = useState(false);
    const toolbarRef = createRef();
    const prevMouseDown = useRef();
    useEffect(() => prevMouseDown.current = props.mouseDown)

    useEffect(() => {

        if (props.mouseDown && toolbarRef.current.style.opacity === "0") {
            setTimeout(() => {
                if (toolbarRef.current)
                toolbarRef.current.style.display = "none";
            }, 500);
        } else {
            toolbarRef.current.style.display = "block";
        }
    });

    function getStyle() {
        if (props.mouseDown) {
            return {opacity: 0, animation: 'fadeOutComplete .5s forwards'}
        }
        if (prevMouseDown.current && !props.mouseDown) {
            return {opacity: 0.5, animation: 'fadeInFromComplete .5s forwards'}
        }
        return !isActive ? {opacity: 0.5, animation: 'fadeOut .5s forwards'} : {
            opacity: 1.0,
            animation: 'fadeIn .5s forwards'
        }
    }

    return (
        <div ref={el => toolbarRef.current = el} style={getStyle()} className="bottomtoolbar"
             onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
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
                <div className="divider"/>
                <li>
                    <img width="24px" height="24px" onClick={props.clearBoard} src={CrossIcon} alt={"Clear Board"}/>
                </li>
                <li>
                    <img width="24px" height="24px" onClick={() => props.setIsPopupVisible(true)} src={LinkIcon}
                         alt="Get Share Link"/>
                </li>
            </ul>
        </div>
    )
}

export default BottomToolbar;