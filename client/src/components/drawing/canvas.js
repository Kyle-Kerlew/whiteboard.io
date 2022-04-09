import {
  Divider,
  Snackbar,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import {
  ErrorMessage,
  Formik,
} from 'formik';
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
  editTitle,
} from '../../reducers/whiteboardReducer';
import '../../styles/shareLinkBox.css';
import SignInAsGuestSchema from '../schema/SignInAsGuest.yup';
import COLORS from '../shared/constants/colors';
import FocusDialogBox from '../shared/focusDialogBox';
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

  function showSuccessToast () {
    setIsToastVisible(true);
  }

  async function handleGuestSubmit (values) {
    await UserController.createGuest(values);
    dispatch(loginUser('guest'));
  }

  return (
    <div id='canvas-container'>
      <canvas
        className='drawing-board'
        height={window.innerHeight}
        onMouseDown={(event) => {
          drawingEngine.current.isMouseDown = true;
          drawingEngine.current.handleDrawingStart(event);
        }}
        onMouseLeave={() => drawingEngine.current.isMouseDown = false}
        onMouseMove={(event) => drawingEngine.current.handleDragTouch(event, shape)}
        onMouseUp={(event) => drawingEngine.current.handleEndDrawing(event, shape)}
        onTouchEnd={drawingEngine.current.handleEndDrawing}
        onTouchMove={drawingEngine.current.handleDragTouch}
        onTouchStart={drawingEngine.current.handleDrawingStart}
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
            <Formik
              initialValues={{
                email: '',
                firstName: '',
                lastName: '',
              }}
              onSubmit={handleGuestSubmit}
              validationSchema={SignInAsGuestSchema}
            >
              {({
                values,
                handleBlur,
                handleSubmit,
                handleChange,
              }) => <FocusDialogBox
                buttonText='Confirm'
                isValid={Boolean(values.firstName && values.lastName && values.email)}
                onSubmit={(event) => handleSubmit(event)}
                text='Let other collaborators know who you are!'
              >
                <div className='form-container'>
                  <TextField
                    label='First Name'
                    name='firstName'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type='text'
                    value={values.firstName}
                  />
                  <ErrorMessage name='firstName' />
                  <TextField
                    label='Last Name'
                    name='lastName'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type='text'
                    value={values.lastName}
                  />
                  <ErrorMessage name='lastName' />
                  <TextField
                    label='Email'
                    name='email'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type='email'
                    value={values.email}
                  />
                  <ErrorMessage name='email' />
                </div>
              </FocusDialogBox>}
            </Formik>}
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
