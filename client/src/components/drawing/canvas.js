import React, {useRef, useState, useEffect} from 'react';
import Toolbar from "../toolbar/toolbar";
import {Socket} from '../socket/socket';
import ShareLinkBox from "../toolbar/tools/linkShareTool";
import '../../styles/shareLinkBox.css';
import {Divider, Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import EraserTool from "../toolbar/tools/eraserTool";
import ZoomInTool from "../toolbar/tools/zoomInTool";
import ZoomOutTool from "../toolbar/tools/zoomOutTool";
import ClearBoardTool from "../toolbar/tools/clearBoardTool";
import Circle from "../svg/circle";
import {useRouteMatch} from "react-router-dom";

function Canvas() {
    const [drawingData, setDrawingData] = useState([]);
    const [paintSize, setPaintSize] = useState(25);
    const [mouseDown, setMouseDown] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [color, setColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch('/:canvasId').params;
    const canvasRef = useRef();
    const prevX = useRef();
    const prevY = useRef();
    const isMobile = useRef(false);
    const scale = useRef(1);
    const xLeftView = useRef(0);
    const yTopView = useRef(0);
    const widthViewOriginal = useRef(0);
    const heightViewOriginal = useRef(0);
    const widthView = useRef(widthViewOriginal.current);
    const heightView = useRef(heightViewOriginal.current);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        window.addEventListener('keydown', handleKeyDown)
        Socket.emit("load-data", {
            whiteboardId: whiteboardId
        });
        Socket.on("data-loaded", data => {
            redrawAllPoints(data, () => setDrawingData(data));
        });
        Socket.on("empty-page-from-server", () => clearBoard(false));
        Socket.on("drawing-data-from-server", data => drawPoint(data));
        return () => {
            window.removeEventListener('resize', handleWindowResize);
            window.removeEventListener('keydown', handleKeyDown);
        }

    }, []);

    function redrawAllPoints(data = drawingData, updateState = undefined) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.beginPath();
        for (let i = 0; i < data.length; i++) {
            drawPoint(data[i], updateState);
        }
    }

    function clearBoard(emitMessage) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        emitMessage && Socket.emit("empty-page", whiteboardId);
        setDrawingData([]);

    }

    function drawPoint(data, updateState = () => setDrawingData(drawingData.concat(data))) {
        const context = canvasRef.current.getContext('2d');
        const moveTo = data.moveTo;
        const lineTo = data.lineTo;
        context.scale(scale.current, scale.current);
        context.beginPath();
        context.moveTo(moveTo.x, moveTo.y);
        context.lineTo(lineTo.x, lineTo.y);
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = lineTo.size;
        context.strokeStyle = lineTo.color;
        context.stroke();
        context.closePath();
        updateState && updateState();
    }

    function handleWindowResize() {
        redrawAllPoints();
    }

    function handleKeyDown(e) {
        if (e.ctrlKey && e.key === '=') {
            e.preventDefault(); //prevent browser from zooming normally
            handleZoomIn();
        }
        if (e.ctrlKey && e.key === '-') {
            e.preventDefault(); //prevent browser from zooming normally
            handleZoomOut();
        }
    }


    function handleDrawPointMovement(e) {
        const context = canvasRef.current.getContext('2d');
        setMouseDown(true);
        context.beginPath();

        if (e.type === 'touchmove') {
            isMobile.current = true;
            prevX.current = e.touches[0].pageX;
            prevY.current = e.touches[0].pageY;
        } else {
            isMobile.current = false;
            prevX.current = e.pageX;
            prevY.current = e.pageY;

        }
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
        context.moveTo(prevX.current, prevY.current);
        context.lineTo(prevX.current, prevY.current);
        Socket.emit('drawing-data', newDrawData);

    }

    function handleStartMovementDrawing(e) {
        const context = canvasRef.current.getContext('2d');
        if (mouseDown) {
            if (e.type === "touchmove") {
                context.lineTo(e.touches[0].pageX, e.touches[0].pageY); //this is where the mobile mouseCoords are stored for some reason
                isMobile.current = true;
            } else {
                context.lineTo(e.pageX, e.pageY);
                isMobile.current = false;
            }
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
            drawPoint(newDrawData);
            Socket.emit('drawing-data', newDrawData);
            prevX.current = e.pageX;
            prevY.current = e.pageY;
        }
    }

    function handleEndDrawing(e) {
        const context = canvasRef.current.getContext('2d');
        setMouseDown(false);
        context.stroke();
        context.closePath();
    }

    function zoom() {
        let X = canvasRef.current.width / 2; //Canvas coordinates
        let Y = canvasRef.current.height / 2;
        let x = X / canvasRef.current.width * widthView.current + xLeftView.current;  // View coordinates
        let y = Y / canvasRef.current.height * heightView.current + yTopView.current;
        widthView.current *= scale.current;
        heightView.current *= scale.current;
        if (widthView.current > widthViewOriginal.current || heightView.current > heightViewOriginal.current) {
            widthView.current = widthViewOriginal.current;
            heightView.current = heightViewOriginal.current;
            x = widthView / 2;
            y = heightView / 2;
        }
        xLeftView.current = x - widthView / 2;
        yTopView.current = y - heightView / 2;
        drawingData.forEach(point => {
            point.moveTo.x *= scale.current;
            point.moveTo.y *= scale.current;
            point.lineTo.x *= scale.current;
            point.lineTo.y *= scale.current;
        })

    }

    function handleZoomIn() {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        scale.current = 1.5;
        zoom();
        redrawAllPoints();
    }

    function handleZoomOut() {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        scale.current = 2 / 3;
        zoom();
        redrawAllPoints();
    }

    function showSuccessToast() {
        setIsToastVisible(true);
    }

    const paintSizes = [5, 30, 55];
    const colors = ['red', 'blue', 'green', 'yellow', 'black']

    return (
        <div className="canvas-container">
            <canvas
                onMouseLeave={() => setMouseDown(false)}
                className="drawing-board"
                ref={canvasRef}
                onTouchStart={handleDrawPointMovement}
                onTouchMove={handleStartMovementDrawing}
                onMouseDown={handleDrawPointMovement}
                onMouseUp={handleEndDrawing}
                onTouchEnd={handleEndDrawing}
                onMouseMove={handleStartMovementDrawing}
                width={2000}
                height={1500}
            >
                Please update your browser.
            </canvas>
            {isToastVisible &&
            <Snackbar onClose={() => setIsToastVisible(false)} open={isToastVisible} autoHideDuration={6000}>
                <Alert severity="success">
                    We've copied the link to your clipboard!
                </Alert>
            </Snackbar>}
            <Toolbar position='bottom' mouseDown={mouseDown}>
                {paintSizes.map(size => (
                        <React.Fragment key={size}>
                            <Circle identifier={size} onClick={() => setPaintSize(size)} size={size}/>
                        </React.Fragment>
                    )
                )}
                <EraserTool setIsErasing={() => setColor('white')}/>
                <Divider orientation="vertical" flexItem/>
                <ZoomInTool zoomIn={handleZoomIn}/>
                <ZoomOutTool zoomOut={handleZoomOut}/>
                <Divider orientation="vertical" flexItem/>
                <ClearBoardTool clearBoard={clearBoard}/>
                <ShareLinkBox showSuccessToast={showSuccessToast} text={"Copy this link to share and collaborate!"}/>
            </Toolbar>
            <Toolbar position='left' mouseDown={mouseDown}>
                {colors.map(color => (
                    <React.Fragment key={color}>
                        <Circle
                            identifier={color}
                            color={color}
                            onClick={() => setColor(color)}
                            size={30}/>
                    </React.Fragment>
                ))}
            </Toolbar>
        </div>
    );
}

export default Canvas;
