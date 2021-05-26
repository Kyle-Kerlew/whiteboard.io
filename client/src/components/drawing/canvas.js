import React, {createRef, useRef, useState, useEffect, useCallback} from 'react';
import _ from 'lodash';
import BottomToolbar from "../toolbar/bottomtoolbar";
import SideToolbar from "../toolbar/sidetoolbar";
import {Socket} from '../socket/socket';
import {useRouteMatch} from "react-router-dom";
import ShareLinkBox from "../shared/linkShare";
import '../../styles/shareLinkBox.css';
import {DialogContent, Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function Canvas() {
    const canvasRef = useRef();
    const [newData, setNewData] = useState();
    const [paintSize, setPaintSize] = useState(25);
    const [mouseDown, setMouseDown] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const isDragging = useRef(false);
    const [color, setColor] = useState('black');
    const [isErasing, setIsErasing] = useState(false);
    const {canvasId: whiteboardId} = useRouteMatch('/:canvasId').params;
    const points = useRef([]);
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

    function updateBoardManyPoints(data, context) {
        if (!_.isEmpty(data)) {
            for (let i = 0; i < data.length; i++) {

                const moveTo = data[i].moveTo;
                const lineTo = data[i].lineTo;
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.scale(canvasRef.current.width / widthView.current, canvasRef.current.height / heightView.current);
                context.translate(-xLeftView.current, -yTopView.current);

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
        points.current = [];
    }

    function drawPoint(data) {
        const context = canvasRef.current.getContext('2d');
        if (!_.isEmpty(data)) {
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
        } else {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }

    function handleWindowResize() {
        const context = canvasRef.current.getContext('2d');
        updateBoardManyPoints(points.current, context);
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

    useEffect(() => {
        setIsErasing(false);
    }, [color])
    useEffect(() => drawPoint(newData), [newData]);
    useEffect(() => {
        const context = canvasRef.current.getContext('2d');

        window.addEventListener('resize', handleWindowResize);
        window.addEventListener('keydown', handleKeyDown)
        Socket.emit("load-data", {
            whiteboardId: whiteboardId
        });
        Socket.on("data-loaded", (data) => {
            if (!_.isEmpty(data)) {
                points.current = data;
                updateBoardManyPoints(data, context);
            }
        });
        Socket.on("empty-page-from-server", () => setNewData([]));
        Socket.on("drawing-data-from-server", data => {
            if (!_.isEmpty(data)) {
                setNewData(data);
                points.current.push(data);
            }
        })
        return () => {
            window.removeEventListener('resize', handleWindowResize);
            window.removeEventListener("keydown", handleKeyDown);
        }

    }, []);


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
        context.moveTo(prevX, prevY);
    }

    function handleStartMovementDrawing(e) {
        const context = canvasRef.current.getContext('2d');
        if (mouseDown) {
            isDragging.current = true;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = paintSize;
            context.strokeStyle = color;

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

            if (isErasing) {
                context.globalCompositeOperation = 'destination-out'
                context.stroke();

            } else {
                context.globalCompositeOperation = 'source-over';
                Socket.emit("drawing-data", newDrawData);
                points.current.push(newDrawData);
                context.stroke();

            }
            prevX.current = e.pageX;
            prevY.current = e.pageY;
        }
    }

    function handleEndDrawing(e) {
        const context = canvasRef.current.getContext('2d');
        if (!isDragging.current) {
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
        }
        setMouseDown(false);
        isDragging.current = false;
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
        points.current.forEach(point => {
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
        updateBoardManyPoints(points.current, context);
    }

    function handleZoomOut() {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        scale.current = 2 / 3;
        zoom();
        updateBoardManyPoints(points.current, context);
    }

    function showSuccessToast() {
        setIsToastVisible(true);
    }

    return (
        <div className="canvas-container">
            {isPopupVisible &&
            <div className={"container"}>
                <ShareLinkBox whiteboardId={whiteboardId}
                              setIsVisible={setIsPopupVisible}
                              showSuccessToast={showSuccessToast}
                              text={"Copy this link to share and collaborate!"}/>
            </div>
            }

            <canvas onMouseLeave={() => setMouseDown(false)} id="drawing-board" ref={(ref) => canvasRef.current = ref}
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
            <BottomToolbar mouseDown={mouseDown} drawPoint={drawPoint} setMouseDown={setMouseDown}
                           setIsPopupVisible={setIsPopupVisible}
                           setPaintSize={setPaintSize}
                           clearBoard={clearBoard}
                           zoomIn={handleZoomIn}
                           setIsErasing={setIsErasing}
                           zoomOut={handleZoomOut}
                           id={'bottom-toolbar'}
            />
            <SideToolbar mouseDown={mouseDown} drawPoint={drawPoint} setMouseDown={setMouseDown} setColor={setColor}/>
        </div>
    );
}

export default Canvas;
