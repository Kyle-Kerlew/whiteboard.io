import React, {createRef, useEffect, useRef, useState} from 'react';
import '../../styles/bottomtoolbar.css';
import CrossIcon from '../../resources/svg/cross-icon.svg'
import LinkIcon from '../../resources/svg/link-icon.svg'
import ZoomInIcon from '../../resources/svg/zoom-in-icon.svg'
import ZoomOutIcon from '../../resources/svg/zoom-out-icon.svg'
import Circle from "../svg/circle";

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
        <div id={props.id} ref={el => toolbarRef.current = el} style={getStyle()} className="bottomtoolbar"
             onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
            <ul>
                <li>
                    <Circle onClick={() => props.setPaintSize(5)} width={25} height={25}/>
                </li>
                <li>
                    <Circle onClick={() => props.setPaintSize(30)} width={50} height={50}/>
                </li>
                <li>
                    <Circle onClick={() => props.setPaintSize(55)} width={75} height={75}/>
                </li>
                <div className="divider"/>
                <li>
                    <img width={"36px"} height={"36px"} onClick={props.zoomIn} src={ZoomInIcon} alt={"Zoom In"}/>
                </li>
                <li>
                    <img width={"36px"} height={"36px"} onClick={props.zoomOut} src={ZoomOutIcon} alt={"Zoom Out"}/>
                </li>
                <div className="divider"/>

                <li>
                    <img width={"36px"} height={"36px"} onClick={props.clearBoard} src={CrossIcon} alt={"Clear Board"}/>
                </li>
                <li>
                    <img width={"36px"} height={"36px"} onClick={() => props.setIsPopupVisible(true)} src={LinkIcon}
                         alt="Get Share Link"/>
                </li>
            </ul>
        </div>
    )
}

export default BottomToolbar;