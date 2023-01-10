import {
    Divider,
    Snackbar,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    UserController,
} from '../../handlers/rest/userController';
import {
    WhiteboardController,
} from '../../handlers/rest/whiteboardController';
import {
    loginUser,
} from '../../reducers/userReducer';
import {
    addCollaborator,
    setTitle,
} from '../../reducers/whiteboardReducer';
import shareLinkBox from './../../styles/ShareLinkBox.module.css';
import divider from './../../styles/Divider.module.css';
import SignInAsGuestSchema from './../../components/schema/SignInAsGuest.yup';
import Colors from './../../components/shared/constants/colors';
import GuestModalForm from './../../components/shared/guestModalForm';
import Loading from './../../components/shared/loading';
import Circle from './../../public/resources/svg/circle';
import Toolbar from './../../components/toolbar/toolbar';
import ClearBoardTool from './../../components/toolbar/tools/clearBoardTool';
import DownloadImageTool from './../../components/toolbar/tools/downloadImageTool';
import InputModesTool from './../../components/toolbar/tools/inputModesTool';
import ShareLinkBox from './../../components/toolbar/tools/linkShareTool';
import ShapeTool from './../../components/toolbar/tools/shapeTool';
import UndoRedoTool from './../../components/toolbar/tools/undoRedoTool';
import ZoomInTool from './../../components/toolbar/tools/zoomInTool';
import ZoomOutTool from './../../components/toolbar/tools/zoomOutTool';
import {
    DrawingEngine,
} from '../../components/drawing/DrawingEngine';
import {
    SocketEngine,
} from '../../components/drawing/SocketEngine';
import {useRouter} from "next/router";
import {Authentication} from "../../components/shared/Authentication";

export default function Whiteboard({data}) {
    const [
        isToastVisible,
        setIsToastVisible,
    ] = useState(false);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);
    const [
        canvasMouseDown,
        setCanvasMouseDown,
    ] = useState(false);

    const drawingEngine = useRef({});
    const socketEngine = useRef({});
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });
    const router = useRouter();
    const {whiteboard: whiteboardId} = router.query;

    const user = useSelector((state) => state.user.value);
    const canvasRef = useRef();
    const dispatch = useDispatch();
    Authentication(dispatch)();

    useEffect(() => {
        if (!windowSize.width || !windowSize.height) {
            return;
        }
        const response = data;
        if (response) {
            for (const collaborator of response.collaborators) {
                dispatch(addCollaborator(collaborator));
            }

            dispatch(setTitle(response.title));
            if (response.strokes && response.strokes.length > 0) {
                drawingEngine.current.drawingData = response.strokes;
                drawingEngine.current.draw(drawingEngine.current.drawingData);
            }

            setIsLoading(false);

        }
    }, [windowSize])
    useEffect(() => {
        console.log("2")
        if (user.isLoadingUser || !user.role) {
            return;
        }


        socketEngine.current = new SocketEngine(dispatch);
        console.log("canvas ref", canvasRef)
        drawingEngine.current = new DrawingEngine(
            {
                canvasContext: canvasRef.current.getContext('2d'),
                setCanvasMouseDown,
                whiteboardId,
            },
        );
        socketEngine.current.drawingEngine = drawingEngine.current;
        drawingEngine.current.socketEngine = socketEngine.current;

        const context = canvasRef.current.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);


        socketEngine.current.initializeSocketListeners(whiteboardId).then(r => {
            setWindowSize({
                height: window.innerHeight,
                width: window.innerWidth
            })
            window.addEventListener('keydown', (event) => drawingEngine.current.handleKeyDown(event), {
                passive: false,
            });
            window.addEventListener('wheel', (event) => drawingEngine.current.handleScrollZoom(event), {
                passive: false,
            });
            window.addEventListener('resize', () => {
                drawingEngine.current.handleResize();
            });
        });

        return () => {
            // removeWindowListeners();
            socketEngine.current.disconnect();
        };
    }, [
        dispatch,
        user.isLoadingUser,
        user.role,
        whiteboardId,
    ]);

    const setShape = (shape) => {
        drawingEngine.current.shape = shape;
    };


    // const attachWindowListeners = () => {
    //
    // };
    //
    // const removeWindowListeners = () => {
    //   window.removeEventListener('keydown', drawingEngine.current.handleKeyDown);
    //   window.removeEventListener('resize', drawingEngine.current.handleResize);
    //   window.removeEventListener('wheel', drawingEngine.current.handleScrollZoom);
    // };

    const showSuccessToast = () => {
        setIsToastVisible(true);
    };

    const handleGuestSubmit = async (values) => {
        await UserController.createGuest(values);
        dispatch(loginUser('guest'));
    };

    const handleMouseMove = (event) => {
        // Is object empty? Prevents errors when moving mouse as page loads
        if (Object.keys(drawingEngine.current).length !== 0) {
            drawingEngine.current.handleDragTouch(event);
        }
    };

    const handleMouseUp = (event) => {
        if (canvasMouseDown) {
            drawingEngine.current.handleEndStroke(event);
        }
    };

    const handleTouchEnd = (event) => {
        drawingEngine.current.handleEndStroke(event);
    };

    const handleTouchMove = (event) => {
        drawingEngine.current.handleDragTouch(event);
    };

    const handleTouchStart = (event) => {
        drawingEngine.current.handleDrawingStart(event);
    };

    const handleMouseLeave = () => {
        drawingEngine.current.isMouseDown = false;
    };

    const handleMouseDown = (event) => {
        drawingEngine.current.isMouseDown = true;
        drawingEngine.current.handleDrawingStart(event);
    };

    const handleZoomIn = drawingEngine.current.scaleUp;
    const handleZoomOut = drawingEngine.current.scaleDown;
    const handleMarkerClick = (value) => {
        drawingEngine.current.paintSize = value;
    };

    const handleMarkerSelect = (color) => {
        drawingEngine.current.markerColor = color;
    };

    return (
        <div className={shareLinkBox['canvas-container']}>
            {isLoading &&
                <Loading/>}
            <canvas
                className={shareLinkBox['drawing-board']}
                height={windowSize.height}
                id='canvas'
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
                ref={canvasRef}
                width={windowSize.width}
            >
                Please update your browser.
            </canvas>
            {isToastVisible &&
                <Snackbar
                    autoHideDuration={6000}
                    onClose={() => setIsToastVisible(false)}
                    open={isToastVisible}
                >
                    <Alert severity='success'>
                        We've copied the link to your clipboard!
                    </Alert>
                </Snackbar>}
            {!user.isLoadingUser &&
                <>
                    {!user.isAuthenticated && !user.role &&
                        <GuestModalForm handleFormSubmit={handleGuestSubmit} schema={SignInAsGuestSchema}/>}
                </>}
            <Toolbar isMouseDown={canvasMouseDown} position='bottom'>
                <ShapeTool handleChange={setShape}/>
                <InputModesTool
                    handleMarkerClick={handleMarkerClick}
                />
                <UndoRedoTool onRedo={drawingEngine.current.handleRedo} onUndo={drawingEngine.current.handleUndo}/>
                <Divider className={divider.divider} flexItem orientation='vertical'/>
                <ZoomInTool zoomIn={handleZoomIn}/>
                <ZoomOutTool zoomOut={handleZoomOut}/>
                <ShareLinkBox
                    showSuccessToast={showSuccessToast}
                    text='Copy this link to share and collaborate!'
                />
                <DownloadImageTool
                    getDownloadData={() => canvasRef.current.toDataURL('image/png')}
                />
                <Divider className={divider.divider} flexItem orientation='vertical'/>
                <ClearBoardTool clearBoard={drawingEngine.current.clearBoard}/>
            </Toolbar>
            <Toolbar isMouseDown={drawingEngine.current.isMouseDown} position='left'>
                {
                    Object.values(Colors).map((color) => <React.Fragment key={color}>
                        <Circle
                            color={color}
                            identifier={color}
                            onClick={() => handleMarkerSelect(color)}
                            size={50}
                        />
                    </React.Fragment>)
                }
            </Toolbar>
        </div>
    );
}

export async function getServerSideProps({params}) {
    const data = await WhiteboardController.getWhiteboardById(params.whiteboard);

    return {
        props: {
            data,
        }, // will be passed to the page component as props
    }
}
