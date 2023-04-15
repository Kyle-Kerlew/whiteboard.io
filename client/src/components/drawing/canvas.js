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
  useRouteMatch,
} from 'react-router-dom';
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
import '../../styles/shareLinkBox.css';
import '../../styles/divider.css';
import SignInAsGuestSchema from '../schema/SignInAsGuest.yup';
import COLORS from '../shared/constants/colors';
import GuestModalForm from '../shared/guestModalForm';
import Loading from '../shared/loading';
import Circle from '../svg/circle';
import Toolbar from '../toolbar/toolbar';
import ClearBoardTool from '../toolbar/tools/clearBoardTool';
import DownloadImageTool from '../toolbar/tools/downloadImageTool';
import InputModesTool from '../toolbar/tools/inputModesTool';
import ShareLinkBox from '../toolbar/tools/linkShareTool';
import ShapeTool from '../toolbar/tools/shapeTool';
import UndoRedoTool from '../toolbar/tools/undoRedoTool';
import ZoomInTool from '../toolbar/tools/zoomInTool';
import ZoomOutTool from '../toolbar/tools/zoomOutTool';
import {
  DrawingEngine,
} from '../../engines/drawingEngine';
import {
  SocketEngine,
} from '../../engines/socketEngine';

const Canvas = () => {
  const [
    isToastVisible,
    setIsToastVisible,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);
  const [
    canvasMouseDown,
    setCanvasMouseDown,
  ] = useState(false);

  const drawingEngine = useRef({});
  const socketEngine = useRef({});
  const {
    canvasId: whiteboardId,
  } = useRouteMatch('/boards/:canvasId').params;

  const user = useSelector((state) => state.user.value);
  const canvasRef = useRef();
  const animationCanvasRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const setWhiteboardData = async () => {
      const response = await WhiteboardController.getWhiteboardById(whiteboardId);
      if (response) {
        for (const collaborator of response.collaborators) {
          dispatch(addCollaborator(collaborator));
        }


        dispatch(setTitle(response.title));
        if (response.strokes) {
          drawingEngine.current.draw(response.strokes);
          drawingEngine.current.drawingData = response.strokes;
        }

        setIsLoading(false);
      }
    };

    if (drawingEngine && drawingEngine !== {}) {
      socketEngine.current = new SocketEngine(dispatch);
      drawingEngine.current = new DrawingEngine(
        {
          canvasContext: canvasRef.current.getContext('2d'),
          animationContext: animationCanvasRef.current.getContext('2d'),
          setCanvasMouseDown,
          whiteboardId,
        },
      );
      socketEngine.current.drawingEngine = drawingEngine.current;
      drawingEngine.current.socketEngine = socketEngine.current;
    }
    if (!user.isLoadingUser && user.role) {
      socketEngine.current.initializeSocketListeners(whiteboardId);

      setWhiteboardData();
    }
  }, [
    dispatch,
    user.isLoadingUser,
    user.role,
    whiteboardId,
  ]);

  const setShape = (shape) => {
    drawingEngine.current.shape = shape;
  };

  const attachWindowListeners = () => {
    window.addEventListener('keydown', (event) => drawingEngine.current.handleKeyDown(event), {
      passive: false,
    });
    window.addEventListener('wheel', (event) => drawingEngine.current.handleScrollZoom(event), {
      passive: false,
    });
    window.addEventListener('resize', () => drawingEngine.current.handleResize());
  };

  const removeWindowListeners = () => {
    window.removeEventListener('keydown', drawingEngine.current.handleKeyDown);
    window.removeEventListener('resize', drawingEngine.current.handleResize);
    window.removeEventListener('wheel', drawingEngine.current.handleScrollZoom);
  };

  useEffect(() => {
    attachWindowListeners();
    return () => {
      removeWindowListeners();
      socketEngine.current.disconnect();
    };
  }, []);

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
    drawingEngine.current.handleDrawingStart(event);
    drawingEngine.current.isMouseDown = true;
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
    <div id='canvas-container'>
      {isLoading &&
      <Loading />}
      <canvas
        className='drawing-board'
        id='canvas'
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
      >
        Please update your browser.
      </canvas>
      <canvas
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
          ref={animationCanvasRef}
          height={window.innerHeight}
          width={window.innerWidth}
          id="animation-layer"></canvas>
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
            <GuestModalForm handleFormSubmit={handleGuestSubmit} schema={SignInAsGuestSchema} />}
        </>}
      <Toolbar isMouseDown={canvasMouseDown} position='bottom'>
        <ShapeTool handleChange={setShape} />
        <InputModesTool
          handleMarkerClick={handleMarkerClick}
        />
        <UndoRedoTool onRedo={drawingEngine.current.handleRedo} onUndo={drawingEngine.current.handleUndo} />
        <Divider className="divider" flexItem orientation='vertical' />
        <ZoomInTool zoomIn={handleZoomIn} />
        <ZoomOutTool zoomOut={handleZoomOut} />
        <ShareLinkBox
          showSuccessToast={showSuccessToast}
          text='Copy this link to share and collaborate!'
        />
        <DownloadImageTool
          getDownloadData={() => canvasRef.current.toDataURL('image/png')}
        />
        <Divider className="divider" flexItem orientation='vertical' />
        <ClearBoardTool clearBoard={drawingEngine.current.clearBoard} />
      </Toolbar>
      <Toolbar isMouseDown={drawingEngine.current.isMouseDown} position='left'>
        {
          Object.values(COLORS).map((color) => <React.Fragment key={color}>
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
};

export default Canvas;
