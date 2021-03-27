import React, {createRef, useRef, useState, useEffect} from 'react';
import _ from 'lodash';
import BottomToolbar from "../toolbar/bottomtoolbar";
import SideToolbar from "../toolbar/sidetoolbar";
import {Socket} from '../socket/socket';
import {useRouteMatch} from "react-router-dom";
import ShareLinkBox from "../shared/linkShare";

function Canvas() {
    const canvasRef = createRef();
    const [newData, setNewData] = useState();
    const [paintSize, setPaintSize] = useState(25);
    const [mouseDown, setMouseDown] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [color, setColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch("/:canvasId").params;

    const prevX = useRef();
    const prevY = useRef();

    function updateBoardManyPoints(data, context) {
        if (!_.isEmpty(data)) {
            for (let i = 0; i < data.length; i++) {
                const moveTo = data[i].moveTo;
                const lineTo = data[i].lineTo;
                context.beginPath();
                context.moveTo(moveTo.x, moveTo.y);
                context.lineTo(lineTo.x, lineTo.y);
                context.lineJoin = 'round';
                context.lineCap = 'round';
                context.lineWidth = lineTo.size;
                context.strokeStyle = lineTo.color;
                context.stroke();
                context.closePath();
            }
        }
    }


    function clearBoard() {
        Socket.emit("empty-page", whiteboardId);
        setNewData([]);

    }

    function drawPoint(data) {
        const context = canvasRef.current.getContext('2d');
        if (!_.isEmpty(data)) {
            //todo: make sure this wont mess up lines and lose sequence
            const moveTo = data.moveTo;
            const lineTo = data.lineTo;
            context.beginPath();
            context.moveTo(moveTo.x, moveTo.y);
            context.lineTo(lineTo.x, lineTo.y);
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = lineTo.size;
            context.strokeStyle = lineTo.color;
            context.stroke();
            context.closePath();
        } else {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }

    useEffect(() => drawPoint(newData), [newData]);

    useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        Socket.emit("load-data", {
            whiteboardId: whiteboardId
        });
        Socket.on("data-loaded", (data) => {
            if (!_.isEmpty(data)) {
                updateBoardManyPoints(data, context);
            }
        });
        Socket.on("empty-page-from-server", () => setNewData([]));
        Socket.on("drawing-data-from-server", data => {
            if (!_.isEmpty(data)) {
                setNewData(data);
            }
        })

    }, []);

    return (
        <React.Fragment>
            {isPopupVisible &&
            <ShareLinkBox whiteboardId={whiteboardId} setIsVisible={setIsPopupVisible}
                          text={"Copy this link to share and collaborate!"}/>
            }
            <canvas id="drawing-board" ref={canvasRef} onClick={(e) => {
                const context = canvasRef.current.getContext('2d');
                context.beginPath();
                prevX.current = e.clientX;
                prevY.current = e.clientY;
                context.moveTo(prevX.current, prevY.current);
                context.lineTo(prevX.current + 1, prevY.current + 1);
                context.lineJoin = 'round';
                context.lineCap = 'round';
                const newDrawData = ({
                    whiteboardId: whiteboardId,
                    lineTo: {
                        x: prevX.current + 1,
                        y: prevY.current + 1,
                        size: paintSize,
                        color: color
                    },
                    moveTo: {
                        x: prevX.current,
                        y: prevY.current
                    }
                });

                Socket.emit("drawing-data", newDrawData);
                context.lineWidth = paintSize;
                context.strokeStyle = color;
                context.stroke();
                context.closePath();

            }} onMouseDown={(e) => {
                const context = canvasRef.current.getContext('2d');
                setMouseDown(true);
                context.beginPath();
                prevX.current = e.clientX;
                prevY.current = e.clientY;
                context.moveTo(prevX, prevY);
            }} onMouseUp={() => {
                const context = canvasRef.current.getContext('2d');
                setMouseDown(false);
                context.closePath();
            }} onMouseMove={(e) => {
                const context = canvasRef.current.getContext('2d');
                if (mouseDown) {
                    context.lineTo(e.clientX, e.clientY);
                    context.lineJoin = 'round';
                    context.lineCap = 'round';
                    context.lineWidth = paintSize;
                    context.strokeStyle = color;
                    context.stroke();
                    const newDrawData = ({
                        whiteboardId: whiteboardId,
                        moveTo: {
                            x: prevX.current,
                            y: prevY.current,
                        },
                        lineTo: {
                            x: e.clientX,
                            y: e.clientY,
                            size: paintSize,
                            color: color

                        },
                    });
                    Socket.emit("drawing-data", newDrawData);
                    prevX.current = e.clientX;
                    prevY.current = e.clientY;
                }
            }}
                    width={window.innerWidth}
                    height={window.innerHeight}
            >
                Please update your browser.
            </canvas>
            <BottomToolbar mouseDown={mouseDown} drawPoint={drawPoint} setMouseDown={setMouseDown} setIsPopupVisible={setIsPopupVisible}
                           setPaintSize={setPaintSize}
                           clearBoard={clearBoard}/>
            <SideToolbar mouseDown={mouseDown} drawPoint={drawPoint} setMouseDown={setMouseDown} setColor={setColor}/>
        </React.Fragment>
    );
}

export default Canvas;
