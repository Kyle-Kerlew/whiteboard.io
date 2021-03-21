import './App.css';
import React, {createRef, useRef, useState, useEffect} from 'react';
import BottomToolbar from './components/toolbar/bottomtoolbar';
import SideToolbar from './components/toolbar/sidetoolbar';
import {io} from 'socket.io-client';
import _ from 'lodash';

function App() {
    console.log("Drawing arr reset");
    const canvasRef = createRef();
    const [drawingData, setDrawingData] = useState([]);
    const [paintSize, setPaintSize] = useState(25);
    const [socket, setSocket] = useState();
    const [mouseDown, setMouseDown] = useState(false);
    const [color, setColor] = useState('black');
    let prevX = useRef();
    let prevY = useRef();
    let drawingArrIndex = useRef(0);

    function clearBoard(socket, canvas, context) {
        socket.emit("empty-page");
        drawingData.current = [];
        context.clearRect(0, 0, canvas.width, canvas.height);

    }

    useEffect(() => {
        const Socket = io("http://localhost:3001");
        setSocket(Socket);
        Socket.on("drawing-data-from-server", data => {
            if (!_.isEqual(data, drawingData)) {
                setDrawingData(data);
            }
        })

    }, []);

    useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        while (drawingData && drawingData.length > drawingArrIndex.current) {
            console.log("Drawing from " + drawingArrIndex + " onward");
            console.log(drawingData)
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
                prevX = e.clientX;
                prevY = e.clientY;
                context.moveTo(prevX, prevY);
                context.lineTo(prevX + 1, prevY + 1);
                context.lineJoin = 'round';
                context.lineCap = 'round';
                socket.emit("drawing-data", {
                    data:
                        {
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
                        }
                })
                context.lineWidth = paintSize;
                context.strokeStyle = color;
                context.stroke();
                context.closePath();

            }} onMouseDown={(e) => {
                const context = canvasRef.current.getContext('2d');
                setMouseDown(true);
                context.beginPath();
                prevX = e.clientX;
                prevY = e.clientY;
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
                    socket.emit("drawing-data", {
                        data: {
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
                        }
                    })
                    prevX = e.clientX;
                    prevY = e.clientY;
                }
            }}
                    width={window.innerWidth}
                    height={window.innerHeight}
            >
                Please update your browser.
            </canvas>
            <BottomToolbar setPaintSize={setPaintSize}/>
            <SideToolbar setColor={setColor}/>
        </React.Fragment>
    );
}

export default App;
