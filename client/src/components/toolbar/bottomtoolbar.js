import React, {createRef, useEffect, useRef, useState} from 'react';
import '../../styles/bottomtoolbar.css';
import CrossIcon from '../../resources/svg/cross-icon.svg'
import LinkIcon from '../../resources/svg/link-icon.svg'
import ZoomInIcon from '../../resources/svg/zoom-in-icon.svg'
import ZoomOutIcon from '../../resources/svg/zoom-out-icon.svg'
import Circle from '../svg/circle';
import EraserIcon from '../../resources/svg/eraser-icon.svg';

const BottomToolbar = ({
                           mouseDown,
                           id,
                           setPaintSize,
                           zoomIn,
                           zoomOut,
                           clearBoard,
                           setIsPopupVisible,
                           setIsErasing
                       }) => {

    const [isActive, setIsActive] = useState(false);
    const toolbarRef = createRef();
    const prevMouseDown = useRef();
    useEffect(() => prevMouseDown.current = mouseDown)

    useEffect(() => {

        if (mouseDown && toolbarRef.current.style.opacity === "0") {
            setTimeout(() => {
                if (toolbarRef.current)
                    toolbarRef.current.style.display = "none";
            }, 500);
        } else {
            toolbarRef.current.style.display = "block";
        }
    });

    function getStyle() {
        if (mouseDown) {
            return {opacity: 0, animation: 'fadeOutComplete .5s forwards'}
        }
        if (prevMouseDown.current && !mouseDown) {
            return {opacity: 0.5, animation: 'fadeInFromComplete .5s forwards'}
        }
        return !isActive ? {opacity: 0.5, animation: 'fadeOut .5s forwards'} : {
            opacity: 1.0,
            animation: 'fadeIn .5s forwards'
        }
    }

    return (
        <div id={id} ref={el => toolbarRef.current = el} style={getStyle()} className="bottomtoolbar"
             onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
            <ul>
                <li>
                    <Circle onClick={() => setPaintSize(5)} width={25} height={25}/>
                </li>
                <li>
                    <Circle onClick={() => setPaintSize(30)} width={50} height={50}/>
                </li>
                <li>
                    <Circle onClick={() => setPaintSize(55)} width={75} height={75}/>
                </li>
                <li>
                    <img idth={"36px"} height={"36px"} alt="Eraser" src={EraserIcon}
                         onClick={() => setIsErasing(true)}/>
                </li>
                <div className="divider"/>
                <li>
                    <img width={"36px"} height={"36px"} onClick={zoomIn} src={ZoomInIcon} alt={"Zoom In"}/>
                </li>
                <li>
                    <img width={"36px"} height={"36px"} onClick={zoomOut} src={ZoomOutIcon} alt={"Zoom Out"}/>
                </li>
                <div className="divider"/>

                <li>
                    <img width={"36px"} height={"36px"} onClick={clearBoard} src={CrossIcon} alt={"Clear Board"}/>
                </li>
                <li>
                    <img width={"36px"} height={"36px"} onClick={() => setIsPopupVisible(true)} src={LinkIcon}
                         alt="Get Share Link"/>
                </li>
            </ul>
        </div>
    )
}

export default BottomToolbar;