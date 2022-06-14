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
    this._shapeStartPoint = undefined;
    this._shape = props.shape;
    this._paintSize = 25;
    this._markerColor = props.markerColor || 'black';
    this._whiteboardId = props.whiteboardId;
    this._scale = 1;
    this._currHistoryOffset = 0;
    this._drawingData = [];
    this._isMouseDown = false;
    this._shapeDataToDraw = [];
    // 2D array. Each index represents a "stroke" and contains an array of the values of the subpath
    this._history = {};
    this._setCanvasMouseDown = props.setCanvasMouseDown;
    bindAll(this);
  }

  get newStroke () {
    return this._isFirstStroke;
  }

  set newStroke (isFirstStroke) {
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

  get history () {
    return this._history;
  }

  set history (history) {
    this._history = history;
  }

  get shapeDataToDraw () {
    return this._shapeDataToDraw;
  }

  set shapeDataToDraw (shapeDataToDraw) {
    this._shapeDataToDraw = shapeDataToDraw;
  }

  get currHistoryOffset () {
    return this._currHistoryOffset;
  }

  set currHistoryOffset (currentHistoryIndex) {
    this._currHistoryOffset = currentHistoryIndex;
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

  handleRedo () {
    if (this.currHistoryOffset === 0) {
      // nothing to redo
      return;
    }

    this.currHistoryOffset += 1;
    const context = this.canvasContext;
    const strokesToDraw = Object.values(Object.fromEntries(Object.entries(this.history).slice(0, Object.keys(this.history).length - Math.abs(this.currHistoryOffset))));

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (!strokesToDraw || strokesToDraw.length === 0) {
      return;
    }

    for (const strokes of strokesToDraw) {
      this.canvasContext.beginPath();
      this.draw(strokes);
      this.canvasContext.stroke();
    }
  }

  handleUndo () {
    if (Math.abs(this.currHistoryOffset) > Object.keys(this.history).length - 1) {
      return;
    }

    const context = this.canvasContext;
    this.currHistoryOffset -= 1;
    const strokesToDraw = Object.values(Object.fromEntries(Object.entries(this.history).slice(0, Object.keys(this.history).length - Math.abs(this.currHistoryOffset))));

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (!strokesToDraw || strokesToDraw.length === 0) {
      return;
    }

    for (const strokes of strokesToDraw) {
      this.canvasContext.beginPath();
      this.draw(strokes);
      this.canvasContext.stroke();
    }
  }

  handleResize () {
    const context = this.canvasContext;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    this.draw(this.applyScaleToData());
  }

  handleScrollZoom (event) {
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
      event.preventDefault();
      this.scaleUp();
    }

    if (event.ctrlKey && event.key === '-') {
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
    this.newStroke = true;
    context.moveTo(mouseX, mouseY);
    // initialize a new "stroke"
    context.beginPath();
    if (this.history && Object.keys(this.history).length >= 30) {
      delete this.history[0];

      // Shift left
      for (let index = 0; index < Object.keys(this.history).length; index++) {
        if (!this.history[index + 1]) {
          delete this.history[index];
          break;
        }

        this.history[index] = this.history[index + 1];
      }
    }

    // initialize new history entry
    this.history[Object.keys(this.history).length] = [];
  }

  handleDragTouch (event) {
    if (!this.isMouseDown) {
      return;
    }

    const context = this.canvasContext;
    const mouseX = this.getMousePositionX(event, context.canvas.offsetLeft);
    const mouseY = this.getMousePositionY(event, context.canvas.offsetTop);
    const subpathData = {
      color: this.markerColor,
      size: this.paintSize,
      whiteboardId: this.whiteboardId,
      x: mouseX,
      y: mouseY,
    };

    if (this.newStroke) {
      subpathData.moveTo = {
        x: mouseX,
        y: mouseY,
      };
      this.newStroke = false;
    }

    switch (this.shape) {
    case Shapes.LINE:
    case Shapes.SQUARE:
    case Shapes.CIRCLE:
      subpathData.shape = this.shape;

      if (this.shapeStartPoint) {
        subpathData.shapeStartPoint = this.shapeStartPoint;
      } else {
        this.shapeStartPoint = {
          x: mouseX,
          y: mouseY,
        };
        subpathData.shapeStartPoint = this.shapeStartPoint;
        subpathData.moveTo = this.shapeStartPoint;
      }

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      this.draw(this.drawingData.concat(subpathData));
      this.shapeDataToDraw = subpathData;
      break;
    default:
      this.draw(subpathData);
      Socket.emit('drawing-data', subpathData);
      this.drawingData = this.drawingData.concat(subpathData);
      this.history[Object.keys(this.history).length - 1].push(subpathData);
      context.stroke();
      break;
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

  handleEndStroke () {
    this.isMouseDown = false;
    this.shape = undefined;
    this.shapeStartPoint = undefined;
    if (this.shapeDataToDraw) {
      this.history[Object.keys(this.history).length - 1].push(this.shapeDataToDraw);
      this.drawingData = this.drawingData.concat(this.shapeDataToDraw);
      Socket.emit('drawing-data', this.shapeDataToDraw);
      this.shapeDataToDraw = undefined;
    }
  }

  scaleUp () {
    this.scale *= 1.25; // inverse of 4/5 or 0.8
    this.handleZoom(1.25, 1.25);
  }

  scaleDown () {
    this.scale *= 0.8; // inverse of 5/4 or 1.25
    this.handleZoom(0.8, 0.8);
  }

  drawPoint (x, y, colorToDraw, sizeToUse, moveTo, shape, shapeStartPoint, array = false) {
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

    switch (shape) {
    case Shapes.SQUARE:
      context.moveTo(shapeStartPoint.x, shapeStartPoint.y);
      context.strokeRect(shapeStartPoint.x, shapeStartPoint.y, x - shapeStartPoint.x, y - shapeStartPoint.y);
      break;
    case Shapes.CIRCLE:
      context.moveTo(shapeStartPoint.x, shapeStartPoint.y);
      context.beginPath();
      context.ellipse(shapeStartPoint.x, shapeStartPoint.y, Math.abs(x - shapeStartPoint.x), Math.abs(y - shapeStartPoint.y), 0, 0, 2 * Math.PI);
      break;
    case Shapes.LINE:
      context.beginPath();
      context.moveTo(shapeStartPoint.x, shapeStartPoint.y);
      context.lineTo(x, y);

      break;
    default:
      context.lineTo(x, y);
    }

    context.stroke();
  }

  draw (data) {
    if (_.isArray(data)) {
      for (const item of data) {
        this.drawPoint(item.x, item.y, item.color, item.size, item.moveTo, item.shape, item.shapeStartPoint, true);
      }

      return;
    }

    this.drawPoint(data.x, data.y, data.color, data.size, data.moveTo, data.shape, data.shapeStartPoint);
  }

  handleZoom (canvasTransformX, canvasTransformY) {
    const context = this.canvasContext;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.canvas.width *= canvasTransformX;
    context.canvas.height *= canvasTransformY;
    context.scale(this.scale, this.scale);
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
}