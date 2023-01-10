
import {
    addCollaborator,
    removeCollaborator,
    setTitle
} from '../../reducers/whiteboardReducer';
import Socket from "../../configuration/socket";

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
        this.socket.emit('empty-page', whiteboardId);
    }

    socketSendDrawingData(data) {
        this.socket.emit('drawing-data', data);
    }

    async initializeSocketListeners(whiteboardId) {
        const socket = await Socket.getInstance();
        this.socket = socket;
        socket.connect();
        console.log("connecting to socket")
        socket.emit('join', whiteboardId);
        socket.on('empty-page-from-server', () => this.drawingEngine.clearBoard(false));
        socket.on('drawing-data-from-server', (data) => this.drawingEngine.draw(data));
        socket.on('joined', (data) => this.dispatch(addCollaborator(data)));
        socket.on('left', (data) => this.dispatch(removeCollaborator(data)));
        socket.on('update-title', (data) => this.dispatch(setTitle(data)));
    }

    disconnect() {
        this.socket.disconnect();
    }
}
