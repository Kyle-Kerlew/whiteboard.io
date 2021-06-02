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
    const [paintSize, setPaintSize] = useState(25);
    const [mouseDown, setMouseDown] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [color, setColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch('/:canvasId').params;
    const canvasRef = useRef();
    const scale = useRef(1);

    const isMobile = useRef(false);

    function handleResize() {
        const context = canvasRef.current.getContext('2d');
        const data = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.width = window.innerWidth / 2;
        context.canvas.height = window.innerHeight / 2;
        context.putImageData(data, 0, 0);
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize);
        Socket.emit("load-data", {
            whiteboardId: whiteboardId
        });
        Socket.on("data-loaded", data => redrawAllPoints(data));
        Socket.on("empty-page-from-server", () => clearBoard(false));
        Socket.on("drawing-data-from-server", data => drawPoint(data));
        return () => window.removeEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function redrawAllPoints(data) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        for (let i = 0; i < data.length; i++) {
            drawPoint({...data[i]});
        }
    }

    function clearBoard(emitMessage) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        emitMessage && Socket.emit("empty-page", whiteboardId);
    }

    function drawPoint({x, y, color, size}) {
        const context = canvasRef.current.getContext('2d');
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = size;
        context.strokeStyle = color;
        context.lineTo(x, y);
        context.stroke();
    }

    function handleKeyDown(e) {
        if (e.ctrlKey && e.key === '=') {
            e.preventDefault(); //prevent browser from zooming normally
            handleZoom(1.5);
        }
        if (e.ctrlKey && e.key === '-') {
            e.preventDefault(); //prevent browser from zooming normally
            handleZoom(.5);
        }
    }

    function handleDrawingStart(e) {
        const context = canvasRef.current.getContext('2d');
        const mouseX = (e.clientX - context.canvas.offsetLeft) / scale.current;
        const mouseY = (e.clientY - context.canvas.offsetTop) / scale.current;
        setMouseDown(true);
        context.beginPath();
        if (e.type === 'touchmove') {
            isMobile.current = true;
            context.moveTo(e.touches[0].clientX, e.touches[0].clientY);
        } else {
            isMobile.current = false;
            context.moveTo(mouseX, mouseY);
        }
    }

    function handleDragTouch(e) {
        const context = canvasRef.current.getContext('2d');
        const mouseX = (e.clientX - context.canvas.offsetLeft) / scale.current;
        const mouseY = (e.clientY - context.canvas.offsetTop) / scale.current;

        if (mouseDown) {
            const newDrawData = {
                whiteboardId: whiteboardId,
                x: e.type === "touchmove" ? e.touches[0].clientX : mouseX,
                y: e.type === "touchmove" ? e.touches[0].clientY : mouseY,
                color: color,
                size: paintSize
            };
            drawPoint({...newDrawData});
            Socket.emit('drawing-data', newDrawData);
        }
    }

    function handleEndDrawing(e) {
        setMouseDown(false);
    }

    function scaleUp() {
        scale.current *= 1.5;
        handleZoom();
    }

    function scaleDown() {
        scale.current *= .5;
        handleZoom();
    }

    function handleZoom() {
        const context = canvasRef.current.getContext('2d');
        const data = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        const canvasCopy = document.createElement("canvas");
        canvasCopy.getContext('2d').putImageData(data, 0, 0)
        context.canvas.width *= scale.current;
        context.canvas.height *= scale.current;
        context.drawImage(canvasCopy, 0, 0, context.canvas.width, context.canvas.height);
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
                onTouchStart={handleDrawingStart}
                onTouchMove={handleDragTouch}
                onMouseDown={handleDrawingStart}
                onMouseUp={handleEndDrawing}
                onTouchEnd={handleEndDrawing}
                onMouseMove={handleDragTouch}
                width={window.innerWidth / 2}
                height={window.innerHeight / 2}
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
                <ZoomInTool zoomIn={scaleUp}/>
                <ZoomOutTool zoomOut={scaleDown}/>
                <Divider orientation="vertical" flexItem/>
                <ClearBoardTool clearBoard={clearBoard}/>
                <ShareLinkBox showSuccessToast={showSuccessToast}
                              text={"Copy this link to share and collaborate!"}/>
            </Toolbar>
            <Toolbar position='left' mouseDown={mouseDown}>
                {colors.map(color => (
                    <React.Fragment key={color}>
                        <Circle
                            identifier={color}
                            color={color}
                            onClick={() => setColor(color)}
                            size={50}/>
                    </React.Fragment>
                ))}
            </Toolbar>
        </div>
    );
}

export default Canvas;
