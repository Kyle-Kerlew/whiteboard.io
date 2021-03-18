import './App.css';
import React, {createRef, useState, useEffect} from 'react';
import Toolbar from './components/toolbar/toolbar';
import {io} from 'socket.io-client';

function App() {
    const myRef = createRef();
    const [drawingData, setDrawingData] = useState();
    let drawingArrIndex = 0;


    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("drawing-data-from-server", data => {
            setDrawingData(data);
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
        let localMoveTo;
        let localLineTo;
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
            localMoveTo = {
                x: prevX,
                y: prevY
            }
        }
        canvas.onmouseup = () => {
            mouseDown = false;
            context.closePath();
        }
        canvas.onmousemove = (e) => {
            if (mouseDown) {
                prevX = e.clientX;
                prevY = e.clientY;
                context.lineTo(prevX, prevY);
                localLineTo = {
                    x: prevX,
                    y: prevY
                }
                context.stroke();
                socket.emit("drawing-data", {
                    data: {
                        lineTo: {...localLineTo},
                        moveTo: {...localMoveTo}
                    }
                })
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
                console.log("Drawing updates", {...moveTo});
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
