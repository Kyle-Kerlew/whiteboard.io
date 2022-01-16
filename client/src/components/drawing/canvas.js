import {Divider, Snackbar, TextField,} from '@mui/material';
import Alert from '@mui/material/Alert';
import {ErrorMessage, Formik,} from 'formik';
import _ from 'lodash';
import React, {useEffect, useRef, useState,} from 'react';
import {useDispatch, useSelector,} from 'react-redux';
import {useRouteMatch,} from 'react-router-dom';
import * as Yup from 'yup';
import {Socket,} from '../../configuration/socket';
import {UserController,} from '../../handlers/rest/userController';
import {WhiteboardController,} from '../../handlers/rest/whiteboardController';
import {loginUser,} from '../../reducers/userReducer';
import {
  addCollaborator,
  editTitle,
  removeCollaborator,
} from '../../reducers/whiteboardReducer';
import '../../styles/shareLinkBox.css';
import Shapes from '../../types/Shapes';
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

const Canvas = () => {
  const [
    paintSize,
    setPaintSize,
  ] = useState(30);
  const [
    mouseDown,
    setMouseDown,
  ] = useState(false);
  const [
    isToastVisible,
    setIsToastVisible,
  ] = useState(false);
  const [
    drawingData,
    setDrawingData,
  ] = useState([]);

  const lineStartPoint = useRef(null);
  const [
    markerColor,
    setMarkerColor,
  ] = useState('black');
  const {
    canvasId: whiteboardId,
  } = useRouteMatch('/boards/:canvasId').params;
  const [
    shape,
    setShape,
  ] = useState(null);
  const [
    mode,
    setMode,
  ] = useState();

  const [
    firstStroke,
    setFirstStroke,
  ] = useState(false);
  const user = useSelector((state) => state.user.value);
  const canvasRef = useRef();
  const scale = useRef(1);
  const dispatch = useDispatch();

  async function setWhiteboardData () {
    const response = await WhiteboardController.getWhiteboardById(whiteboardId);
    if (response) {
      for (const collaborator of response.collaborators) {
        dispatch(addCollaborator(collaborator));
      }

      dispatch(editTitle(response.title));
      if (response.data) {
        draw(response.data);
        setDrawingData(response.data);
      }
    }
  }

  function handleScrollZoom (e) {
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
    window.addEventListener('resize', handleResize); // dependent on drawingData state
  }, [
    drawingData,
  ]);

  function initializeSocketListeners () {
    Socket.connect();
    Socket.emit('join', whiteboardId);
    Socket.on('empty-page-from-server', () => clearBoard(false));
    Socket.on('drawing-data-from-server', (data) => draw(data));
    Socket.on('joined', (data) => dispatch(addCollaborator(data)));
    Socket.on('left', (data) => dispatch(removeCollaborator(data)));
  }

  useEffect(() => {
    if (!user.isLoadingUser && user.role) {
      initializeSocketListeners();
      setWhiteboardData();
    }
  }, [
    user.isLoadingUser,
  ]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, {
      passive: false,
    });
    window.addEventListener('wheel', handleScrollZoom, {
      passive: false,
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleScrollZoom);
      Socket.disconnect();
    };
  }, []);

  function clearBoard (emitMessage) {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    emitMessage && Socket.emit('empty-page', whiteboardId);
  }

  function handleResize () {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    draw(applyScaleToData(drawingData));
  }

  function handleKeyDown (e) {
    if (e.origin !== process.env.REACT_APP_BASE_URL) {
      return;
    }

    if (e.ctrlKey && e.key === '=') {
      e.preventDefault(); // prevent browser from zooming normally
      scaleUp();
    }

    if (e.ctrlKey && e.key === '-') {
      e.preventDefault(); // prevent browser from zooming normally
      scaleDown();
    }
  }

  function getMousePositionX (e) {
    return e.type === 'touchmove' ?
      e.touches[0].clientX :
      e.clientX;
  }

  function getMousePositionY (e) {
    return e.type === 'touchmove' ?
      e.touches[0].clientY :
      e.clientY;
  }

  function handleDrawingStart (e) {
    const context = canvasRef.current.getContext('2d');
    const mouseX = (getMousePositionX(e) * scale.current - context.canvas.offsetLeft + window.scrollX) / scale.current;
    const mouseY = (getMousePositionY(e) * scale.current - context.canvas.offsetTop - 56 + window.scrollY) / scale.current;
    setMouseDown(true);
    setFirstStroke(true);
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  }

  function handleDragTouch (e) {
    if (mouseDown) {
      const context = canvasRef.current.getContext('2d');
      const mouseX = (getMousePositionX(e) * scale.current - context.canvas.offsetLeft + window.scrollX) / scale.current;
      const mouseY = (getMousePositionY(e) * scale.current - context.canvas.offsetTop - 56 + window.scrollY) / scale.current;
      const newDrawData = {
        color: markerColor,
        size: paintSize,
        whiteboardId,
        x: mouseX,
        y: mouseY,
      };

      if (firstStroke) {
        newDrawData.moveTo = {
          x: mouseX,
          y: mouseY
        };
        setFirstStroke(false);
      }
      switch (shape) {
      case Shapes.LINE:
        if (lineStartPoint.current) {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          drawLine(lineStartPoint.current.x, lineStartPoint.current.y, mouseX, mouseY);
          context.beginPath();
          draw(drawingData);
        } else {
          lineStartPoint.current = {
            x: mouseX,
            y: mouseY,
          };
        }

        break;
      default:
        draw(newDrawData);
        setDrawingData((previousState) => previousState.concat(newDrawData));
        Socket.emit('drawing-data', newDrawData);
        break;
      }
    }
  }

  function drawLine (startX, startY, endX, endY) {
    const context = canvasRef.current.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = paintSize;
    context.strokeStyle = markerColor;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }

  function handleEndDrawing (e) {
    const context = canvasRef.current.getContext('2d');
    const mouseX = (getMousePositionX(e) * scale.current - context.canvas.offsetLeft + window.scrollX) / scale.current;
    const mouseY = (getMousePositionY(e) * scale.current - context.canvas.offsetTop - 56 + window.scrollY) / scale.current;
    const newDrawData = {
      color: markerColor,
      size: paintSize,
      whiteboardId,
      x: mouseX,
      y: mouseY,
    };

    switch (shape) {
    case Shapes.LINE:
      (async () => {
        await setDrawingData((previousState) => {
          return previousState.concat([
            {
              color: markerColor,
              moveTo: {
                x: lineStartPoint.current.x,
                y: lineStartPoint.current.y,
              },
              size: paintSize,
              whiteboardId,
              x: mouseX,
              y: mouseY,
            },
          ]);
        });
        lineStartPoint.current = null;
        setShape(null);
        context.beginPath();
      })();

      break;
    default:
      draw(newDrawData);
      setDrawingData((previousState) => previousState.concat(newDrawData));
      break;
    }

    setMouseDown(false);
    // Socket.emit('drawing-data', newDrawData);
  }

  function scaleUp () {
    scale.current = 1.25;
    handleZoom();
  }

  function scaleDown () {
    scale.current = 0.8;
    handleZoom();
  }

  function draw (data) {
    function drawPoint (x, y, colorToDraw, sizeToUse, moveTo) {
      const context = canvasRef.current.getContext('2d');
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.lineWidth = sizeToUse;
      context.strokeStyle = colorToDraw;
      if (moveTo) {
        context.beginPath();
        context.moveTo(moveTo.x, moveTo.y);
      }

      context.lineTo(x, y);
      context.stroke();
    }

    if (_.isArray(data)) {
      const context = canvasRef.current.getContext('2d');
      for (const item of data) {
        drawPoint(item.x, item.y, item.color, item.size, item.moveTo);
      }

      return;
    }

    drawPoint(data.x, data.y, data.color, data.size, data.moveTo);
  }

  function handleZoom () {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width *= scale.current;
    context.canvas.height *= scale.current;
    draw(applyScaleToData(drawingData));
  }

  async function handleGuestSubmit (values) {
    await UserController.createGuest(values);
    dispatch(loginUser('guest'));
  }

  function applyScaleToData (data) {
    return data.map((item) => {
      item.x *= scale.current;
      item.y *= scale.current;
      return item;
    });
  }

  function showSuccessToast () {
    setIsToastVisible(true);
  }

  const SignInAsGuestSchema = Yup.object()
    .shape({
      email: Yup.string()
        .email('The email provided is invalid.')
        .required('Email is required.'),
      firstName: Yup.string()
        .min(2, 'First Name must be more than 1 character.')
        .max(50, 'First Name must be less than 50 characters.')
        .required('First name is required.'),
      lastName: Yup.string()
        .min(2, 'Last name must be more than 1 character.')
        .max(50, 'Last name must be less than 50 characters.')
        .required('Last name is required.'),
    });

  const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'black',
  ];

  return (
    <div id='canvas-container'>
      <canvas
        className='drawing-board'
        height={window.innerHeight}
        onMouseDown={handleDrawingStart}
        onMouseLeave={() => setMouseDown(false)}
        onMouseMove={handleDragTouch}
        onMouseUp={handleEndDrawing}
        onTouchEnd={handleEndDrawing}
        onTouchMove={handleDragTouch}
        onTouchStart={handleDrawingStart}
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
                errors,
              }) => <FocusDialogBox
                buttonText='Confirm'
                isValid={Boolean(values.firstName && values.lastName && values.email)}
                onSubmit={(e) => handleSubmit(e)}
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
      }
      <Toolbar mouseDown={mouseDown} position='bottom'>
        <InputModesTool
          handleMarkerClick={(value) => setPaintSize(value)}
          handlePresentationClick={() => setMode((previous) => (previous === 'Presentation' ?
            'Drawing' :
            'Presentation'))}
        />
        <ShapeTool handleChange={(option) => setShape(option)} />
        <EraserTool setIsErasing={() => setMarkerColor('white')} />
        <Divider flexItem orientation='vertical' />
        <ZoomInTool zoomIn={scaleUp} />
        <ZoomOutTool zoomOut={scaleDown} />
        <Divider flexItem orientation='vertical' />
        <ClearBoardTool clearBoard={clearBoard} />
        <ShareLinkBox
          showSuccessToast={showSuccessToast}
          text='Copy this link to share and collaborate!'
        />
        <DownloadImageTool
          getDownloadData={() => canvasRef.current.toDataURL('image/png')}
        />
      </Toolbar>
      <Toolbar mouseDown={mouseDown} position='left'>
        {
          colors.map((color) => <React.Fragment key={color}>
            <Circle
              color={color}
              identifier={color}
              onClick={() => setMarkerColor(color)}
              size={50}
            />
          </React.Fragment>)
        }
      </Toolbar>
    </div>
  );
};

export default Canvas;
