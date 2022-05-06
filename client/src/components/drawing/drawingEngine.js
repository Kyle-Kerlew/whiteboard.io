import _ from 'lodash';
import * as Constants from '../../configuration/constants';
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
  canvasPic;

  constructor (props) {
    this._canvasContext = props.canvasContext;
    this._shapeStartPoint = undefined;
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

  get shapeStartPoint () {
    return this._shapeStartPoint;
  }

  set shapeStartPoint (lineStartPoint) {
    this._shapeStartPoint = lineStartPoint;
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
    delete this.drawingData;
    if (emitMessage) {
      Socket.emit('empty-page', this.whiteboardId);
    }

    this.drawingData = [];
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  handleResize () {
    const context = this.canvasContext;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    this.draw(this.applyScaleToData());
  }

  handleScrollZoom (event) {
    console.log('Handle scroll zoom');
    if (event.isTrusted && event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.scaleUp();
      } else {
        this.scaleDown();
      }
    }
  }

  handleKeyDown (event) {
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

  getMousePositionX (event, xOffset) {
    if (event.type === 'touchmove') {
      return (event.touches[0].clientX - xOffset + window.scrollX) / this.scale;
    } else {
      return (event.clientX - xOffset + window.scrollX) / this.scale;
    }
  }

  getMousePositionY (event, yOffset) {
    if (event.type === 'touchmove') {
      return (event.touches[0].clientY - yOffset - 56 + window.scrollY) / this.scale;
    } else {
      return (event.clientY - yOffset - 56 + window.scrollY) / this.scale;
    }
  }

  handleDrawingStart (event) {
    const context = this.canvasContext;
    const mouseX = this.getMousePositionX(event, context.canvas.offsetLeft);
    const mouseY = this.getMousePositionY(event, context.canvas.offsetTop);
    this.isFirstStroke = true;
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  }

  handleDragTouch (event, shape) {
    if (this.isMouseDown) {
      const context = this.canvasContext;
      const mouseX = this.getMousePositionX(event, context.canvas.offsetLeft);
      const mouseY = this.getMousePositionY(event, context.canvas.offsetTop);
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
      case Shapes.SQUARE:
        if (this.shapeStartPoint) {
          if (!this.canvasPic) {
            const canvasPic = new Image();
            canvasPic.src = document.querySelector('#canvas').toDataURL();
            canvasPic.onload = () => context.drawImage(canvasPic, 0, 0);
            this.canvasPic = canvasPic;
          }

          context.beginPath();
          // This causes a very unfortunate flashing
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          context.drawImage(this.canvasPic, 0, 0);
          this.drawShape(shape, this.shapeStartPoint.x, this.shapeStartPoint.y, mouseX, mouseY);
        } else {
          this.shapeStartPoint = {
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
    const mouseX = this.getMousePositionX(event, context.canvas.offsetLeft);
    const mouseY = this.getMousePositionY(event, context.canvas.offsetTop);
    const newDrawData = {
      color: this.markerColor,
      shape,
      size: this.paintSize,
      whiteboardId: this.whiteboardId,
      x: mouseX,
      y: mouseY,
    };

    switch (shape) {
    case Shapes.LINE:
    case Shapes.SQUARE:

      newDrawData.moveTo = {
        x: this.shapeStartPoint ? this.shapeStartPoint.x : newDrawData.x,
        y: this.shapeStartPoint ? this.shapeStartPoint.y : newDrawData.y,
      };

      this.drawingData = this.drawingData.concat(newDrawData);
      this.shapeStartPoint = undefined;
      this.shape = undefined;
      this.canvasPic = undefined;
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
    this.scale *= 1.25; // inverse of 4/5 or 0.8
    this.handleZoom(1.25, 1.25);
  }

  scaleDown () {
    this.scale *= 0.8; // inverse of 5/4 or 1.25
    this.handleZoom(0.8, 0.8);
  }

  drawPoint (x, y, colorToDraw, sizeToUse, moveTo, shape, array = false) {
    const context = this.canvasContext;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = sizeToUse;
    context.strokeStyle = colorToDraw;
    if (moveTo && array) {
      context.stroke();
    }

    if (moveTo) {
      context.beginPath();
      context.moveTo(moveTo.x, moveTo.y);
    }

    if (shape === Shapes.SQUARE) {
      context.strokeRect(moveTo.x, moveTo.y, x - moveTo.x, y - moveTo.y);
    } else {
      context.lineTo(x, y);
    }

    if (!array) {
      context.stroke();
    }
  }

  draw (data) {
    if (_.isArray(data)) {
      for (const item of data) {
        this.drawPoint(item.x, item.y, item.color, item.size, item.moveTo, item.shape);
      }

      return;
    }

    this.drawPoint(data.x, data.y, data.color, data.size, data.moveTo, data.shape);
  }

  handleZoom (canvasTransformX, canvasTransformY) {
    const context = this.canvasContext;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width *= canvasTransformX;
    context.canvas.height *= canvasTransformY;
    context.scale(this.scale, this.scale);
    console.log('Drawing data', this.drawingData);
    this.draw(this.drawingData);
    context.beginPath();
  }

  applyScaleToData () {
    return this.drawingData.map((item) => {
      item.x *= this.scale;
      item.y *= this.scale;
      if (item.moveTo) {
        item.moveTo.x *= this.scale;
        item.moveTo.y *= this.scale;
      }

      return item;
    });
  }

  drawShape (shape, startX, startY, currentX, currentY) {
    const context = this.canvasContext;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = this.paintSize;
    context.strokeStyle = this.markerColor;
    context.moveTo(startX, startY);
    switch (shape) {
    case Shapes.SQUARE:
      context.strokeRect(startX, startY, currentX - startX, currentY - startY);
      break;
    case Shapes.LINE:
      context.lineTo(currentX, currentY);
      break;
    }

    context.stroke();
  }
}
