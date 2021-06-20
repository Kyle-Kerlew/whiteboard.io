import React, {useEffect, useRef, useState} from 'react';
import Toolbar from "../toolbar/toolbar";
import {Socket} from '../../configuration/socket';
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
import DownloadImageTool from "../toolbar/tools/downloadImageTool";
import {WhiteboardController} from "../../handlers/rest/whiteboardController";
import _ from 'lodash';
import MarkerOptionsTool from "../toolbar/tools/markerOptionsTool";

function Canvas() {
    const [paintSize, setPaintSize] = useState(25);
    const [brushStartPos, setBrushStartPos] = useState();
    const [mouseDown, setMouseDown] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [drawingData, setDrawingData] = useState([]);
    const [markerColor, setMarkerColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch('/:canvasId').params;
    const canvasRef = useRef();
    const scale = useRef(1);

    async function setWhiteboardData() {
        const response = await WhiteboardController.getWhiteboardById(whiteboardId);
        if (response.data && response.data.data) {
            draw(response.data.data);
            setDrawingData(response.data.data);
        }
    }

    function handleScrollZoom(e) {
        if (e.origin !== process.env.REACT_APP_BASE_URL) {
            return;
        }
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
                scaleUp();
            } else {
                scaleDown();
            }
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize); //dependent on drawingData state
    }, [drawingData]);


    useEffect(() => {
        setWhiteboardData();
        Socket.connect();
        window.addEventListener('keydown', handleKeyDown, {passive: false});
        window.addEventListener('wheel', handleScrollZoom, {passive: false});


        Socket.on("empty-page-from-server", () => clearBoard(false));
        Socket.on("drawing-data-from-server", data => draw(data));
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('wheel', handleScrollZoom);
            Socket.disconnect();
        }
    }, []);

    function clearBoard(emitMessage) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        emitMessage && Socket.emit("empty-page", whiteboardId);
    }

    function handleResize() {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
        draw(applyScaleToData(drawingData));

    }

    function handleKeyDown(e) {
        if (e.origin !== process.env.REACT_APP_BASE_URL) {
            return;
        }
        if (e.ctrlKey && e.key === '=') {
            e.preventDefault(); //prevent browser from zooming normally
            scaleUp();
        }
        if (e.ctrlKey && e.key === '-') {
            e.preventDefault(); //prevent browser from zooming normally
            scaleDown();
        }
    }

    function getMousePositionX(e) {
        return e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    }

    function getMousePositionY(e) {
        return e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    }

    function handleDrawingStart(e) {
        const context = canvasRef.current.getContext('2d');
        const mouseX = ((getMousePositionX(e) * scale.current) - context.canvas.offsetLeft + window.scrollX) / scale.current;
        const mouseY = ((getMousePositionY(e) * scale.current) - context.canvas.offsetTop - 56 + window.scrollY) / scale.current;
        setMouseDown(true);
        context.beginPath();
        context.moveTo(mouseX, mouseY);
        setBrushStartPos({x: mouseX, y: mouseY});
    }

    function handleDragTouch(e) {
        if (mouseDown) {
            const context = canvasRef.current.getContext('2d');
            const mouseX = ((getMousePositionX(e) * scale.current) - context.canvas.offsetLeft + window.scrollX) / scale.current;
            const mouseY = ((getMousePositionY(e) * scale.current) - context.canvas.offsetTop - 56 + window.scrollY) / scale.current;
            const newDrawData = {
                whiteboardId: whiteboardId,
                x: mouseX,
                y: mouseY,
                color: markerColor,
                size: paintSize,
            };
            if (brushStartPos) {
                newDrawData.moveTo = brushStartPos;
            }
            draw(newDrawData);
            setDrawingData(prevState => prevState.concat(newDrawData));
            Socket.emit('drawing-data', newDrawData);
            setBrushStartPos(undefined)
        }
    }

    function handleEndDrawing(e) {
        const context = canvasRef.current.getContext('2d');
        const mouseX = ((getMousePositionX(e) * scale.current) - context.canvas.offsetLeft + window.scrollX) / scale.current;
        const mouseY = ((getMousePositionY(e) * scale.current) - context.canvas.offsetTop - 56 + window.scrollY) / scale.current;
        const newDrawData = {
            whiteboardId: whiteboardId,
            x: mouseX,
            y: mouseY,
            color: markerColor,
            size: paintSize,
        };
        draw(newDrawData);
        setDrawingData(prevState => prevState.concat(newDrawData));
        Socket.emit('drawing-data', newDrawData);
        setMouseDown(false);
    }

    function scaleUp() {
        scale.current = 1.25;
        handleZoom();
    }

    function scaleDown() {
        scale.current = .8;
        handleZoom();
    }

    function draw(data) {
        function drawPoint(x, y, colorToDraw, sizeToUse, moveTo) {
            const context = canvasRef.current.getContext('2d');
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = sizeToUse;
            context.strokeStyle = colorToDraw;
            if (moveTo) {
                context.moveTo(moveTo.x, moveTo.y);
                context.beginPath();
            }
            context.lineTo(x, y);
            context.stroke();
        }

        if (_.isArray(data)) {
            for (const item of data) {
                drawPoint(item.x, item.y, item.color, item.size, item.moveTo);
            }
            return;
        }
        drawPoint(data.x, data.y, data.color, data.size, data.moveTo);
    }


    function handleZoom() {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.width *= scale.current;
        context.canvas.height *= scale.current;
        draw(applyScaleToData(drawingData));
    }

    function applyScaleToData(data) {
        return data.map(item => {
            item.x *= scale.current;
            item.y *= scale.current;
            return item;
        });
    }

    function showSuccessToast() {
        setIsToastVisible(true);
    }

    const paintSizes = [5, 30, 55];
    const colors = ['red', 'blue', 'green', 'yellow', 'black']

    return (
        <div id="canvas-container">
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                <MarkerOptionsTool/>
                <Divider orientation="vertical" flexItem/>
                <EraserTool setIsErasing={() => setMarkerColor('white')}/>
                <ZoomInTool zoomIn={scaleUp}/>
                <ZoomOutTool zoomOut={scaleDown}/>
                <ClearBoardTool clearBoard={clearBoard}/>
                <Divider orientation="vertical" flexItem/>
                <ShareLinkBox showSuccessToast={showSuccessToast}
                              text={"Copy this link to share and collaborate!"}/>
                <DownloadImageTool getDownloadData={() => canvasRef.current.toDataURL("image/png")}/>
            </Toolbar>
            <Toolbar position='left' mouseDown={mouseDown}>
                {colors.map(color => (
                    <React.Fragment key={color}>
                        <Circle
                            identifier={color}
                            color={color}
                            onClick={() => setMarkerColor(color)}
                            size={50}/>
                    </React.Fragment>
                ))}
            </Toolbar>
        </div>
    );
}

export default Canvas;
