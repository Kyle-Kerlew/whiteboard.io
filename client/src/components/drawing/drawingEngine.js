import _ from 'lodash';
import {
  Socket,
} from '../../configuration/socket';
import Shapes from '../../types/Shapes';

function bindAll (target) {
  const keys = Object.getOwnPropertyNames(target.constructor.prototype);
  for (const key of keys) {
    const propertyOrMethod = target[key];
    if (typeof propertyOrMethod === 'function') {
      target[key] = target[key].bind(target);
    }
  }
}

export class DrawingEngine {
  constructor (props) {
    this._canvasContext = props.canvasContext;
    this._lineStartPoint = {
      x: 0,
      y: 0,
    };
    this._shape = props.shape;
    this._paintSize = 25;
    this._markerColor = props.markerColor || 'black';
    this._whiteboardId = props.whiteboardId;
    this._scale = 1;
    this._drawingData = [];
    this._isMouseDown = false;
    this._setCanvasMouseDown = props.setCanvasMouseDown;
    bindAll(this);
  }

  get isFirstStroke () {
    return this._isFirstStroke;
  }

  set isFirstStroke (isFirstStroke) {
    this._isFirstStroke = isFirstStroke;
  }

  get isMouseDown () {
    return this._isMouseDown;
  }

  set isMouseDown (isMouseDown) {
    this._isMouseDown = isMouseDown;
    this._setCanvasMouseDown(isMouseDown);
  }

  get drawingData () {
    return this._drawingData;
  }

  set drawingData (drawingData) {
    this._drawingData = drawingData;
  }

  get canvasContext () {
    return this._canvasContext;
  }

  set canvasContext (canvasContext) {
    this._canvasContext = canvasContext;
  }

  get lineStartPoint () {
    return this._lineStartPoint;
  }

  set lineStartPoint (lineStartPoint) {
    this._lineStartPoint = lineStartPoint;
  }

  get shape () {
    return this._shape;
  }

  set shape (shape) {
    this._shape = shape;
  }

  get paintSize () {
    return this._paintSize;
  }

  set paintSize (paintSize) {
    this._paintSize = paintSize;
  }

  get markerColor () {
    return this._markerColor;
  }

  set markerColor (markerColor) {
    this._markerColor = markerColor;
  }

  get whiteboardId () {
    return this._whiteboardId;
  }

  set whiteboardId (whiteboardId) {
    this._whiteboardId = whiteboardId;
  }

  get scale () {
    return this._scale;
  }

  set scale (scale) {
    this._scale = scale;
  }

  clearBoard (emitMessage) {
    const context = this.canvasContext;
    this.drawingData = [];
    emitMessage && Socket.emit('empty-page', this.whiteboardId);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  handleResize (drawingData) {
    const context = this.canvasContext;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    this.draw(this.applyScaleToData(drawingData));
  }

  handleKeyDown (event) {
    if (event.origin !== process.env.REACT_APP_BASE_URL) {
      return;
    }

    if (event.ctrlKey && event.key === '=') {
      // prevent browser from zooming normally
      event.preventDefault();
      this.scaleUp();
    }

    if (event.ctrlKey && event.key === '-') {
      // prevent browser from zooming normally
      event.preventDefault();
      this.scaleDown();
    }
  }

  getMousePositionX (event) {
    return event.type === 'touchmove' ?
      event.touches[0].clientX :
      event.clientX;
  }

  getMousePositionY (event) {
    return event.type === 'touchmove' ?
      event.touches[0].clientY :
      event.clientY;
  }

  handleDrawingStart (event) {
    const context = this.canvasContext;
    const mouseX = (this.getMousePositionX(event) * this.scale - context.canvas.offsetLeft + window.scrollX) / this.scale;
    const mouseY = (this.getMousePositionY(event) * this.scale - context.canvas.offsetTop - 56 + window.scrollY) / this.scale;
    this.isFirstStroke = true;
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  }

  handleDragTouch (event, shape) {
    if (this.isMouseDown) {
      const context = this.canvasContext;
      const mouseX = (this.getMousePositionX(event) * this.scale - context.canvas.offsetLeft + window.scrollX) / this.scale;
      const mouseY = (this.getMousePositionY(event) * this.scale - context.canvas.offsetTop - 56 + window.scrollY) / this.scale;
      const newDrawData = {
        color: this.markerColor,
        size: this.paintSize,
        whiteboardId: this.whiteboardId,
        x: mouseX,
        y: mouseY,
      };

      if (this.isFirstStroke) {
        newDrawData.moveTo = {
          x: mouseX,
          y: mouseY,
        };
        this.isFirstStroke = false;
      }

      switch (shape) {
      case Shapes.LINE:
        if (this.lineStartPoint) {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          this.drawLine(this.lineStartPoint.x, this.lineStartPoint.y, mouseX, mouseY);
          context.beginPath();
          this.draw(this.drawingData);
        } else {
          this.lineStartPoint = {
            x: mouseX,
            y: mouseY,
          };
        }

        break;
      default:
        this.draw(newDrawData);
        this.drawingData = this.drawingData.concat(newDrawData);
        Socket.emit('drawing-data', newDrawData);
        break;
      }
    }
  }

  drawLine (startX, startY, endX, endY) {
    const context = this.canvasContext;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = this.paintSize;
    context.strokeStyle = this.markerColor;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }

  handleEndDrawing (event, shape) {
    const context = this.canvasContext;
    const mouseX = (this.getMousePositionX(event) * this.scale - context.canvas.offsetLeft + window.scrollX) / this.scale;
    const mouseY = (this.getMousePositionY(event) * this.scale - context.canvas.offsetTop - 56 + window.scrollY) / this.scale;
    const newDrawData = {
      color: this.markerColor,
      size: this.paintSize,
      whiteboardId: this.whiteboardId,
      x: mouseX,
      y: mouseY,
    };

    switch (shape) {
    case Shapes.LINE:
      newDrawData.moveTo = {
        x: this.lineStartPoint.x,
        y: this.lineStartPoint.y,
      };

      this.drawingData = this.drawingData.concat(newDrawData);
      this.lineStartPoint = null;
      this.shape = null;
      context.beginPath();

      break;
    default:
      this.draw(newDrawData);
      this.drawingData.concat(newDrawData);
      break;
    }

    this.isMouseDown = false;
    Socket.emit('drawing-data', newDrawData);
  }

  scaleUp () {
    this.scale = 1.25;
    this.handleZoom();
  }

  scaleDown () {
    this.scale = 0.8;
    this.handleZoom();
  }

  drawPoint (x, y, colorToDraw, sizeToUse, moveTo) {
    const context = this.canvasContext;
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

  draw (data, canvas) {
    if (_.isArray(data)) {
      for (const item of data) {
        this.drawPoint(item.x, item.y, item.color, item.size, item.moveTo, canvas);
      }

      return;
    }

    this.drawPoint(data.x, data.y, data.color, data.size, data.moveTo, canvas);
  }

  handleZoom (drawingData) {
    const context = this.canvasContext;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width *= this.scale;
    context.canvas.height *= this.scale;
    this.draw(this.applyScaleToData(drawingData));
    context.beginPath();
  }

  applyScaleToData (data) {
    return data.map((item) => {
      item.x *= this.scale;
      item.y *= this.scale;
      if (item.moveTo) {
        item.moveTo.x *= this.scale;
        item.moveTo.y *= this.scale;
      }

      return item;
    });
  }
}
