import React, {createRef, useEffect, useRef, useState} from 'react';
import '../../styles/sidetoolbar.css';

const SideToolbar = props => {
    //todo: create a wrapper component as to not duplicate this code
    const [isActive, setIsActive] = useState(false);
    const prevMouseDown = useRef();
    const toolbarRef = createRef();
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
            return {opacity: 0, animation: 'fadeOutComplete .5s linear'}
        }
        if (prevMouseDown.current && !props.mouseDown) {
            return {opacity: 0.5, animation: 'fadeInFromComplete .5s linear'}
        }
        return !isActive ? {opacity: 0.5, animation: 'fadeOut .5s linear'} : {
            opacity: 1.0,
            animation: 'fadeIn 1s linear'
        }
    }

    return (
        <div ref={el => toolbarRef.current = el} style={getStyle()} className="sidetoolbar"
             onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
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