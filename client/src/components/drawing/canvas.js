import React, {createRef, useRef, useState, useEffect} from 'react';
import _ from 'lodash';
import BottomToolbar from "../toolbar/bottomtoolbar";
import SideToolbar from "../toolbar/sidetoolbar";
import {Socket} from '../socket/socket';
import {useRouteMatch} from "react-router-dom";
import ShareLinkBox from "../shared/linkShare";
import '../../styles/shareLinkBox.css';

function Canvas() {
    //TODO: Cache points so we don't need to add all the data each time

    const canvasRef = createRef();
    const [newData, setNewData] = useState();
    const [paintSize, setPaintSize] = useState(25);
    const [mouseDown, setMouseDown] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [color, setColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch("/:canvasId").params;
    const points = useRef([]);
    const prevWidth = useRef();
    const prevHeight = useRef();
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

        function handleWindowResize() {
            const context = document.getElementById('drawing-board').getContext('2d');
            updateBoardManyPoints(points.current, context);
        }

        window.addEventListener('resize', handleWindowResize);
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
        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', handleWindowResize);
        }

    }, []);

    return (
        <div className="canvas-container">
            {isPopupVisible &&
            <div className={"container"}>
                <ShareLinkBox whiteboardId={whiteboardId}
                              setIsVisible={setIsPopupVisible}
                              text={"Copy this link to share and collaborate!"}/>
            </div>
            }

            <canvas onMouseLeave={() => setMouseDown(false)} id="drawing-board" ref={canvasRef} onClick={(e) => {
                //context.scale for zoom in/out
                //context.translate for  movement up, down, left, right
                //TODO: VIEWER/DRAWER MODE?
                const context = canvasRef.current.getContext('2d');
                context.beginPath();

                prevX.current = e.pageX;
                prevY.current = e.pageY;
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
                points.current.push(newDrawData);
                context.lineWidth = paintSize;
                context.strokeStyle = color;
                context.stroke();
                context.closePath();

            }} onMouseDown={(e) => {
                const context = canvasRef.current.getContext('2d');
                setMouseDown(true);
                context.beginPath();
                prevX.current = e.pageX;
                prevY.current = e.pageY;
                context.moveTo(prevX, prevY);
            }} onMouseUp={() => {
                const context = canvasRef.current.getContext('2d');
                setMouseDown(false);
                context.closePath();
            }} onMouseMove={(e) => {
                const context = canvasRef.current.getContext('2d');
                if (mouseDown) {
                    context.lineTo(e.pageX, e.pageY);
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
                            x: e.pageX,
                            y: e.pageY,
                            size: paintSize,
                            color: color

                        },
                    });
                    Socket.emit("drawing-data", newDrawData);
                    points.current.push(newDrawData);
                    prevX.current = e.pageX;
                    prevY.current = e.pageY;
                }
            }}
                    width={2000}
                    height={1500}
            >
                Please update your browser.
            </canvas>
            <BottomToolbar mouseDown={mouseDown} drawPoint={drawPoint} setMouseDown={setMouseDown}
                           setIsPopupVisible={setIsPopupVisible}
                           setPaintSize={setPaintSize}
                           clearBoard={clearBoard}/>
            <SideToolbar mouseDown={mouseDown} drawPoint={drawPoint} setMouseDown={setMouseDown} setColor={setColor}/>
        </div>
    );
}

export default Canvas;
