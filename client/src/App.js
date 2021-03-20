import './App.css';
import React, {createRef, useState, useEffect} from 'react';
import Toolbar from './components/toolbar/toolbar';
import {io} from 'socket.io-client';
import _ from 'lodash';

function App() {
    const myRef = createRef();
    const [drawingData, setDrawingData] = useState();
    let drawingArrIndex = 0;

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("drawing-data-from-server", data => {
            if (!_.isEqual(data, drawingData)) {
                setDrawingData(data);
            }
        })

        let mouseDown = false;
        let prevX;
        let prevY;

        function clearBoard(e) {
            //TODO:
        }

        const canvas = myRef.current;


        const context = canvas.getContext('2d');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        let lastMouseDragLocationX;
        let lastMouseDragLocationY;
        canvas.onclick = (e) => {
            context.beginPath();
            prevX = e.clientX;
            prevY = e.clientY;
            context.moveTo(prevX, prevY);
            context.lineTo(prevX + 1, prevY + 1);
            socket.emit("drawing-data", {
                data:
                    {
                        lineTo: {
                            x: prevX + 1,
                            y: prevY + 1
                        },
                        moveTo: {
                            x: prevX,
                            y: prevY
                        }
                    }
            })
            context.stroke();
            context.closePath();

        }
        canvas.onmousedown = (e) => {
            mouseDown = true;
            context.beginPath();
            prevX = e.clientX;
            prevY = e.clientY;
            context.moveTo(prevX, prevY);
        }
        canvas.onmouseup = () => {
            mouseDown = false;
            context.closePath();
        }
        canvas.onmousemove = (e) => {
            if (mouseDown) {
                context.lineTo(e.clientX, e.clientY);
                context.stroke();
                socket.emit("drawing-data", {
                    data: {
                        moveTo: {
                            x: prevX,
                            y: prevY
                        },
                        lineTo: {
                            x: e.clientX,
                            y: e.clientY
                        },
                    }
                })
                prevX = e.clientX;
                prevY = e.clientY;
            }
        }

    }, []);

    useEffect(() => {
        const canvas = myRef.current;
        const context = canvas.getContext('2d');
        if (drawingData && drawingData.length > drawingArrIndex + 1) {
            for (; drawingArrIndex < drawingData.length; drawingArrIndex++) {
                const moveTo = drawingData[drawingArrIndex].moveTo;
                const lineTo = drawingData[drawingArrIndex].lineTo;
                context.beginPath();
                context.moveTo(moveTo.x, moveTo.y);
                context.lineTo(lineTo.x, lineTo.y);
                context.stroke();
                context.closePath();
            }
        }

    }, [drawingData]);
    return (
        <React.Fragment>
            <canvas id="drawing-board" ref={myRef}>
                Please update your browser.
            </canvas>
            <Toolbar/>
        </React.Fragment>
    );
}

export default App;
