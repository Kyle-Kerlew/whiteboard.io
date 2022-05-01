import {
  Divider,
  Snackbar,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import React, {
  useCallback,
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
  editTitle,
} from '../../reducers/whiteboardReducer';
import '../../styles/shareLinkBox.css';
import SignInAsGuestSchema from '../schema/SignInAsGuest.yup';
import COLORS from '../shared/constants/colors';
import GuestModalForm from '../shared/guestModalForm';
import Circle from '../svg/circle';
import Toolbar from '../toolbar/toolbar';
import ClearBoardTool from '../toolbar/tools/clearBoardTool';
import DownloadImageTool from '../toolbar/tools/downloadImageTool';
import EraserTool from '../toolbar/tools/eraserTool';
import InputModesTool from '../toolbar/tools/inputModesTool';
import ShareLinkBox from '../toolbar/tools/linkShareTool';
import ShapeTool from '../toolbar/tools/shapeTool';
import ZoomInTool from '../toolbar/tools/zoomInTool';
import ZoomOutTool from '../toolbar/tools/zoomOutTool';
import {
  DrawingEngine,
} from './drawingEngine';
import {
  SocketEngine,
} from './socketEngine';

const Canvas = () => {
  const [
    isToastVisible,
    setIsToastVisible,
  ] = useState(false);

  const [
    canvasMouseDown,
    setCanvasMouseDown,
  ] = useState(false);

  const [
    shape,
    setShape,
  ] = useState(undefined);

  const drawingEngine = useRef({});
  const socketEngine = useRef({});
  const {
    canvasId: whiteboardId,
  } = useRouteMatch('/boards/:canvasId').params;

  const user = useSelector((state) => state.user.value);
  const canvasRef = useRef();
  const dispatch = useDispatch();

  async function setWhiteboardData () {
    const response = await WhiteboardController.getWhiteboardById(whiteboardId);
    if (response) {
      for (const collaborator of response.collaborators) {
        dispatch(addCollaborator(collaborator));
      }

      dispatch(editTitle(response.title));
      if (response.data) {
        drawingEngine.current.draw(response.data);
        drawingEngine.current.drawingData = response.data;
      }
    }
  }

  function handleScrollZoom (event) {
    if (event.origin !== process.env.REACT_APP_BASE_URL) {
      return;
    }

    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        drawingEngine.current.scaleUp();
      } else {
        drawingEngine.current.scaleDown();
      }
    }
  }

  useEffect(() => {
    // dependent on drawingData state
    window.addEventListener('resize', drawingEngine.current.handleResize);
  }, [
    drawingEngine.current.drawingData,
  ]);

  useEffect(() => {
    if (drawingEngine && drawingEngine !== {}) {
      socketEngine.current = new SocketEngine();
      drawingEngine.current = new DrawingEngine(
        {
          canvasContext: canvasRef.current.getContext('2d'),
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
    user.isLoadingUser,
  ]);

  function attachWindowListeners () {
    window.addEventListener('keydown', drawingEngine.current.handleKeyDown, {
      passive: false,
    });
    window.addEventListener('wheel', handleScrollZoom, {
      passive: false,
    });
  }

  function removeWindowListeners () {
    window.removeEventListener('keydown', drawingEngine.current.handleKeyDown);
    window.removeEventListener('resize', drawingEngine.current.handleResize);
    window.removeEventListener('wheel', handleScrollZoom);
  }

  useEffect(() => {
    attachWindowListeners();
    return () => {
      removeWindowListeners();
      socketEngine.current.disconnect();
    };
  }, []);

  const showSuccessToast = useCallback(() => {
    setIsToastVisible(true);
  }, [
    setIsToastVisible,
  ]);

  const handleGuestSubmit = useCallback(async (values) => {
    await UserController.createGuest(values);
    dispatch(loginUser('guest'));
  }, []);

  const handleMouseMove = useCallback((event, shape) => {
    // Is object empty? Prevents errors when moving mouse as page loads
    if (Object.keys(drawingEngine.current).length !== 0) {
      drawingEngine.current.handleDragTouch(event, shape);
    }
  }, []);

  const handleMouseUp = useCallback((event, shape) => {
    drawingEngine.current.handleEndDrawing(event, shape);
  }, []);

  const handleTouchEnd = useCallback((event) => {
    drawingEngine.current.handleEndDrawing(event);
  }, []);

  const handleTouchMove = useCallback((event) => {
    drawingEngine.current.handleDragTouch(event);
  }, []);

  const handleTouchStart = useCallback((event) => {
    drawingEngine.current.handleDrawingStart(event);
  }, []);

  const handleMouseLeave = useCallback(() => {
    drawingEngine.current.isMouseDown = false;
  }, []);

  const handleMouseDown = useCallback((e) => {
    drawingEngine.current.isMouseDown = true;
    drawingEngine.current.handleDrawingStart(e);
  }, []);

  return (
    <div id='canvas-container'>
      <canvas
        className='drawing-board'
        height={window.innerHeight}
        id='canvas'
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMouseMove(e, shape)}
        onMouseUp={(e) => handleMouseUp(e, shape)}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={canvasRef}
        width={window.innerWidth}
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
            <GuestModalForm handleFormSubmit={handleGuestSubmit} schema={SignInAsGuestSchema} />}
        </>}
      <Toolbar isMouseDown={canvasMouseDown} position='bottom'>
        <ShapeTool handleChange={setShape} />
        <InputModesTool
          handleMarkerClick={(value) => drawingEngine.current.paintSize = value}
        />
        <EraserTool setIsErasing={() => drawingEngine.current.markerColor = 'white'} />
        <Divider flexItem orientation='vertical' />
        <ZoomInTool zoomIn={drawingEngine.current.scaleUp} />
        <ZoomOutTool zoomOut={drawingEngine.current.scaleDown} />
        <Divider flexItem orientation='vertical' />
        <ClearBoardTool clearBoard={drawingEngine.current.clearBoard} />
        <ShareLinkBox
          showSuccessToast={showSuccessToast}
          text='Copy this link to share and collaborate!'
        />
        <DownloadImageTool
          getDownloadData={() => canvasRef.current.toDataURL('image/png')}
        />
      </Toolbar>
      <Toolbar isMouseDown={drawingEngine.current.isMouseDown} position='left'>
        {
          Object.values(COLORS).map((color) => <React.Fragment key={color}>
            <Circle
              color={color}
              identifier={color}
              onClick={() => drawingEngine.current.markerColor = color}
              size={50}
            />
          </React.Fragment>)
        }
      </Toolbar>
    </div>
  );
};

export default Canvas;
