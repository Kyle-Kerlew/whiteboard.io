import _ from 'lodash';
import {
    Socket,
} from '../configuration/socket';
import Shapes from '../types/Shapes';

function bindAll(target) {
    const keys = Object.getOwnPropertyNames(target.constructor.prototype);
    for (const key of keys) {
        const propertyOrMethod = target[key];
        if (typeof propertyOrMethod === 'function') {
            target[key] = target[key].bind(target);
        }
    }
}

export class DrawingEngine {
    constructor(props) {
        this._canvasContext = props.canvasContext;
        this._animationContext = props.animationContext;
        this._shapeStartPoint = undefined;
        this._animating = false;
        this._shape = props.shape;
        this._paintSize = 25;
        this._markerColor = props.markerColor || 'black';
        this._whiteboardId = props.whiteboardId;
        this._scale = 1;
        this._currHistoryOffset = 0;
        this._drawingData = [];
        this._isMouseDown = false;
        this._shapeDataToDraw = undefined;
        // 2D array. Each index represents a "stroke" and contains an array of the values of the subpath
        this._history = {};
        this._setCanvasMouseDown = props.setCanvasMouseDown;
        bindAll(this);
    }

    get newStroke() {
        return this._isFirstStroke;
    }

    set newStroke(isFirstStroke) {
        this._isFirstStroke = isFirstStroke;
    }

    get isMouseDown() {
        return this._isMouseDown;
    }

    set isMouseDown(isMouseDown) {
        this._isMouseDown = isMouseDown;
        this._setCanvasMouseDown(isMouseDown);
    }

    get drawingData() {
        return this._drawingData;
    }

    set drawingData(drawingData) {
        this._drawingData = drawingData;
    }

    get animating() {
        return this._animating;
    }

    set animating(animating) {
        this._animating = animating;
    }

    get history() {
        return this._history;
    }

    set history(history) {
        this._history = history;
    }

    get shapeDataToDraw() {
        return this._shapeDataToDraw;
    }

    set shapeDataToDraw(shapeDataToDraw) {
        this._shapeDataToDraw = shapeDataToDraw;
    }

    get currHistoryOffset() {
        return this._currHistoryOffset;
    }

    set currHistoryOffset(currentHistoryIndex) {
        this._currHistoryOffset = currentHistoryIndex;
    }

    get canvasContext() {
        return this._canvasContext;
    }

    set canvasContext(canvasContext) {
        this._canvasContext = canvasContext;
    }

    get animationContext() {
        return this._animationContext;
    }

    set animationContext(animationContext) {
        this._animationContext = animationContext;
    }

    get shapeStartPoint() {
        return this._shapeStartPoint;
    }

    set shapeStartPoint(lineStartPoint) {
        this._shapeStartPoint = lineStartPoint;
    }

    get shape() {
        return this._shape;
    }

    set shape(shape) {
        this._shape = shape;
    }

    get paintSize() {
        return this._paintSize;
    }

    set paintSize(paintSize) {
        this._paintSize = paintSize;
    }

    get markerColor() {
        return this._markerColor;
    }

    set markerColor(markerColor) {
        this._markerColor = markerColor;
    }

    get whiteboardId() {
        return this._whiteboardId;
    }

    set whiteboardId(whiteboardId) {
        this._whiteboardId = whiteboardId;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
    }

    clearBoard(emitMessage) {
        const context = this.canvasContext;
        this.drawingData = [];
        this.history = [];
        if (emitMessage) {
            Socket.emit('empty-page', this.whiteboardId);
        }

        // I think the context's scale affects clearing the board when zoomed causing the entire board to not clear when zoomed out
        context.clearRect(0, 0, context.canvas.width * this.scale ** -1, context.canvas.height * this.scale ** -1);
        context.beginPath();
    }

    handleRedo() {
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
            this.draw(strokes, this.canvasContext);
            this.canvasContext.stroke();
        }
    }

    handleUndo() {
        if (Math.abs(this.currHistoryOffset) > Object.keys(this.history).length - 1) {
            return;
        }

        const context = this.canvasContext;
        this.currHistoryOffset -= 1;
        const strokesToDraw = Object.values(Object.fromEntries(Object.entries(this.history).slice(0, Object.keys(this.history).length - Math.abs(this.currHistoryOffset))))
            .flatMap(item => item.subpath);

        const undoneDrawingStrokeId = this.history[Object.keys(this.history).length - Math.abs(this.currHistoryOffset)].strokeId;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        Socket.emit('undo', {strokeId: undoneDrawingStrokeId, whiteboardId: this.whiteboardId});
        if (!strokesToDraw || strokesToDraw.length === 0) {
            return;
        }

        for (const strokes of strokesToDraw) {
            // this.canvasContext.beginPath();
            this.draw(strokes, this.canvasContext);
            this.canvasContext.stroke();
        }
    }

    handleResize() {
        const context = this.canvasContext;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.draw(this.applyScaleToData(), this.canvasContext);
    }

    handleScrollZoom(event) {
        if (!event.isTrusted) {
            return;
        }
        if (event.ctrlKey) {
            event.preventDefault();
            if (event.deltaY < 0) {
                this.scaleUp();
            } else {
                this.scaleDown();
            }
        }
    }

    handleKeyDown(event) {
        if (event.ctrlKey && event.key === '=') {
            event.preventDefault();
            this.scaleUp();
        }

        if (event.ctrlKey && event.key === '-') {
            event.preventDefault();
            this.scaleDown();
        }
    }

    getMousePositionX(event, xOffset) {
        if (event.type === 'touchmove') {
            return (event.touches[0].clientX - xOffset + window.scrollX) / this.scale;
        } else {
            return (event.clientX - xOffset + window.scrollX) / this.scale;
        }
    }

    getMousePositionY(event, yOffset) {
        if (event.type === 'touchmove') {
            return (event.touches[0].clientY - yOffset - 56 + window.scrollY) / this.scale;
        } else {
            return (event.clientY - yOffset - 56 + window.scrollY) / this.scale;
        }
    }

    handleDrawingStart(event) {
        const context = this.shape !== undefined ? this.animationContext : this.canvasContext;
        // if (this.shape !== undefined) {
        //     context.canvas.style.zIndex = "3";
        //     this.animating = true;
        // }

        const mouseX = this.getMousePositionX(event, context.canvas.offsetLeft);
        const mouseY = this.getMousePositionY(event, context.canvas.offsetTop);
        // initialize a new "stroke"
        const strokeId = crypto.randomUUID();
        this.newStroke = true;
        context.moveTo(mouseX, mouseY);
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
        this.history[Object.keys(this.history).length] = {strokeId, subpath: []};
    }

    handleDragTouch(event) {
        if (!this.isMouseDown) {
            return;
        }

        let context = this.shape !== undefined ? this.animationContext : this.canvasContext;
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
                context = this.animationContext;
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

                context.clearRect(0, 0, context.canvas.width / this.scale, context.canvas.height / this.scale);
                let stroke = this.history[Object.keys(this.history).length - 1];

                // stroke.subpath = [subpathData];
                // this.drawingData.push(stroke)
                this.draw(subpathData, context);
                this.shapeDataToDraw = subpathData;
                break;
            default:
                this.draw(subpathData, this.canvasContext);
                const prevStroke = this.history[Object.keys(this.history).length - 1];
                Socket.emit('drawing-data', {
                    whiteboardId: this.whiteboardId,
                    subpath: subpathData,
                    strokeId: prevStroke.strokeId
                });
                prevStroke.subpath = prevStroke.subpath.concat(subpathData);
                this.drawingData.push(prevStroke);
                context.stroke();
                break;
        }
    }

    handleEndStroke() {
        this.isMouseDown = false;
        console.log("ending stroke")

        this.shape = undefined;
        this.shapeStartPoint = undefined;
        this.animating = false;
        if (this.shapeDataToDraw) {
            //clear animation layer
            this.animationContext.clearRect(0, 0, this.animationContext.canvas.width, this.animationContext.canvas.height);

            //draw shape on main layer

            const stroke = this.history[Object.keys(this.history).length - 1];
            stroke.subpath.push(this.shapeDataToDraw);
            this.draw(this.shapeDataToDraw, this.canvasContext);
            this.drawingData = this.drawingData.concat(this.shapeDataToDraw);
            Socket.emit('drawing-data', {
                whiteboardId: this.whiteboardId,
                subpath: this.shapeDataToDraw,
                strokeId: stroke.strokeId
            });
            this.shapeDataToDraw = undefined;
        }
    }

    scaleUp() {
        this.scale *= 1.25; // inverse of 4/5 or 0.8
        this.handleZoom(1.25, 1.25);
    }

    scaleDown() {
        this.scale *= 0.8; // inverse of 5/4 or 1.25
        this.handleZoom(0.8, 0.8);
    }

    drawPoint(x, y, colorToDraw, sizeToUse, moveTo, shape, shapeStartPoint, context) {
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = sizeToUse;
        context.strokeStyle = colorToDraw;

        if (moveTo) {
            context.beginPath();
            context.moveTo(moveTo.x, moveTo.y);
        }

        switch (shape) {
            case Shapes.SQUARE:
                context.moveTo(shapeStartPoint.x, shapeStartPoint.y);
                context.beginPath();
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

    draw(data, context = this.canvasContext) {
        if (_.isArray(data)) {
            for (const stroke of data) {
                for (const point of stroke.subpath) {
                    this.drawPoint(point.x, point.y, point.color, point.size, point.moveTo, point.shape, point.shapeStartPoint, context);
                }
            }
            return;
        }

        this.drawPoint(data.x, data.y, data.color, data.size, data.moveTo, data.shape, data.shapeStartPoint, context);
    }

    handleZoom(canvasTransformX, canvasTransformY) {
        const context = this.canvasContext;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.width *= canvasTransformX;
        context.canvas.height *= canvasTransformY;
        context.scale(this.scale, this.scale);
        this.draw(this.drawingData, context);
    }

    applyScaleToData() {
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
