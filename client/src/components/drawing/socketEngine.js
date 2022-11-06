
import {
    Socket,
} from '../../configuration/socket';
import {
    addCollaborator,
    removeCollaborator,
    setTitle
} from '../../reducers/whiteboardReducer';

export class SocketEngine {
    get drawingEngine() {
        return this._drawingEngine;
    }

    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    set drawingEngine(drawingEngine) {
        this._drawingEngine = drawingEngine;
    }

    socketSendClearBoard(whiteboardId) {
        Socket.emit('empty-page', whiteboardId);
    }

    socketSendDrawingData(data) {
        Socket.emit('drawing-data', data);
    }

    initializeSocketListeners(whiteboardId) {
        Socket.connect();
        Socket.emit('join', whiteboardId);
        Socket.on('empty-page-from-server', () => this.drawingEngine.clearBoard(false));
        Socket.on('drawing-data-from-server', (data) => this.drawingEngine.draw(data));
        Socket.on('joined', (data) => this.dispatch(addCollaborator(data)));
        Socket.on('left', (data) => this.dispatch(removeCollaborator(data)));
        Socket.on('update-title', (data) => this.dispatch(setTitle(data)));
    }

    disconnect() {
        Socket.disconnect();
    }
}
