import React, {useEffect, useRef, useState} from 'react';
import Toolbar from "../toolbar/toolbar";
import {Socket} from '../../configuration/socket';
import ShareLinkBox from "../toolbar/tools/linkShareTool";
import '../../styles/shareLinkBox.css';
import {Divider, Snackbar, TextField} from "@material-ui/core";
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
import {useSelector, useDispatch} from 'react-redux';
import MarkerOptionsTool from "../toolbar/tools/markerOptionsTool";
import FocusDialogBox from "../shared/focusDialogBox";
import {Formik} from "formik";
import {UserController} from "../../handlers/rest/userController";
import {addCollaborator, editTitle, removeCollaborator} from "../../reducers/whiteboardReducer";
import {loginUser} from "../../reducers/userReducer";

function Canvas() {
    const [paintSize, setPaintSize] = useState(25);
    const [brushStartPos, setBrushStartPos] = useState();
    const [mouseDown, setMouseDown] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [drawingData, setDrawingData] = useState([]);
    const [markerColor, setMarkerColor] = useState('black');
    const {canvasId: whiteboardId} = useRouteMatch('/boards/:canvasId').params;
    const user = useSelector(state => state.user.value);
    const canvasRef = useRef();
    const scale = useRef(1);
    const dispatch = useDispatch();

    async function setWhiteboardData() {
        const response = await WhiteboardController.getWhiteboardById(whiteboardId);
        if (response) {
            response.collaborators.forEach(collaborator => dispatch(addCollaborator(collaborator)));
            dispatch(editTitle(response.title));
            if (response.data) {
                draw(response.data);
                setDrawingData(response.data);
            }
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


    function initializeSocketListeners() {
        Socket.connect();
        Socket.emit("join", whiteboardId);
        Socket.on("empty-page-from-server", () => clearBoard(false));
        Socket.on("drawing-data-from-server", data => draw(data));
        Socket.on("joined", data => dispatch(addCollaborator(data)));
        Socket.on("left", data => dispatch(removeCollaborator(data)));
    }

    useEffect(() => {
        if (user.role) {
            initializeSocketListeners();
            setWhiteboardData();
        }
        window.addEventListener('keydown', handleKeyDown, {passive: false});
        window.addEventListener('wheel', handleScrollZoom, {passive: false});

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

    async function handleGuestSubmit(values) {
        await UserController.createGuest(values);
        dispatch(loginUser('guest'));
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
            <React.Fragment>
                {!user.isLoadingUser &&
                <React.Fragment>
                    {!user.isAuthenticated && !user.role &&
                    <Formik initialValues={{firstName: '', lastName: '', email: ''}} onSubmit={handleGuestSubmit}>
                        {({values, handleBlur, handleSubmit, handleChange, errors}) => (
                            <FocusDialogBox buttonText={'Confirm'} text={"Let other collaborators know who you are!"}
                                            isValid={!!(values.firstName && values.lastName && values.email)}
                                            onSubmit={e => handleSubmit(e)}>
                                <div className='form-container'>
                                    <TextField type="text" required name={"firstName"} onChange={handleChange}
                                               value={values.firstName}
                                               onBlur={handleBlur} label="First Name"/>
                                    <TextField required type="text" name={"lastName"} onChange={handleChange}
                                               value={values.lastName}
                                               onBlur={handleBlur} label="Last Name"/>
                                    <TextField required type="email" name={"email"} onChange={handleChange}
                                               value={values.email}
                                               onBlur={handleBlur} label="Email"/>
                                </div>
                            </FocusDialogBox>
                        )}
                    </Formik>
                    }
                </React.Fragment>
                }
            </React.Fragment>
            }
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
