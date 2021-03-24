import React, {createRef, useRef, useState, useEffect} from 'react';
import _ from 'lodash';
import BottomToolbar from "../toolbar/bottomtoolbar";
import SideToolbar from "../toolbar/sidetoolbar";
import {Socket} from '../socket/socket';
import {useRouteMatch} from "react-router-dom";

function Canvas() {
    const canvasRef = createRef();
    const [drawingData, setDrawingData] = useState([]);
    const [paintSize, setPaintSize] = useState(25);
    const [mouseDown, setMouseDown] = useState(false);
    const [color, setColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch("/:canvasId").params;

    const prevX = useRef();
    const prevY = useRef();
    const drawingArrIndex = useRef(0);

    function clearBoard() {
        const context = canvasRef.current.getContext('2d');
        Socket.emit("empty-page");
        setDrawingData([]);
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    }

    useEffect(() => {
        Socket.emit("load-data", {
            whiteboardId: whiteboardId
        })
        Socket.on("data-loaded", (data) => {
            console.log("Retrieved data from server", data);
            if (!_.isEmpty(data)) {
                setDrawingData(data.data);
            }
        })
        Socket.on("drawing-data-from-server", data => {
            if (!_.isEmpty(data) && !_.isEqual(data, drawingData)) {
                setDrawingData(data.data);
            }
        })

    }, []);

    useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        if (!_.isEmpty(drawingData)) {
            Socket.emit("drawing-data", drawingData);
        }
        while (!_.isEmpty(drawingData) && drawingData.length > drawingArrIndex.current) {
            const moveTo = drawingData[drawingArrIndex.current].moveTo;
            const lineTo = drawingData[drawingArrIndex.current].lineTo;
            context.beginPath();
            context.moveTo(moveTo.x, moveTo.y);
            context.lineTo(lineTo.x, lineTo.y);
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = lineTo.size;
            context.strokeStyle = lineTo.color;
            context.stroke();
            context.closePath();
            drawingArrIndex.current += 1;
        }

    }, [drawingData]);

    return (
        <React.Fragment>
            <canvas id="drawing-board" ref={canvasRef} onClick={(e) => {
                const context = canvasRef.current.getContext('2d');
                context.beginPath();
                prevX.current = e.clientX;
                prevY.current = e.clientY;
                context.moveTo(prevX, prevY);
                context.lineTo(prevX + 1, prevY + 1);
                context.lineJoin = 'round';
                context.lineCap = 'round';
                const newDrawData = ({
                    whiteboardId: whiteboardId,
                    lineTo: {
                        x: prevX + 1,
                        y: prevY + 1,
                        size: paintSize,
                        color: color
                    },
                    moveTo: {
                        x: prevX,
                        y: prevY
                    }
                });
                const arr = drawingData;
                arr.push(newDrawData);
                setDrawingData(arr);
                Socket.emit("drawing-data", arr);
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
                            x: prevX,
                            y: prevY,
                        },
                        lineTo: {
                            x: e.clientX,
                            y: e.clientY,
                            size: paintSize,
                            color: color

                        },
                    });
                    const arr = drawingData;
                    arr.push(newDrawData);
                    setDrawingData(arr);
                    Socket.emit("drawing-data", arr);
                    prevX.current = e.clientX;
                    prevY.current = e.clientY;
                }
            }}
                    width={window.innerWidth}
                    height={window.innerHeight}
            >
                Please update your browser.
            </canvas>
            <BottomToolbar setPaintSize={setPaintSize} clearBoard={clearBoard}/>
            <SideToolbar setColor={setColor}/>
        </React.Fragment>
    );
}

export default Canvas;
