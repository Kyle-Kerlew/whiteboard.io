import {
  connect,
} from 'react-redux';
import mapDispatchToProps from 'react-redux/lib/connect/mapDispatchToProps';
import {
  Socket,
} from '../../configuration/socket';
import {
  addCollaborator,
  removeCollaborator,
} from '../../reducers/whiteboardReducer';

export class SocketEngine {
  get drawingEngine () {
    return this._drawingEngine;
  }

  set drawingEngine (drawingEngine) {
    this._drawingEngine = drawingEngine;
  }

  socketSendClearBoard (whiteboardId) {
    Socket.emit('empty-page', whiteboardId);
  }

  socketSendDrawingData (data) {
    Socket.emit('drawing-data', data);
  }

  mapDispatchToProps = (dispatch) => {
    return {
      addCollaborator: (data) => dispatch(addCollaborator(data)),
      removeCollaborator: (data) => dispatch(removeCollaborator(data)),
    };
  };

  initializeSocketListeners (whiteboardId) {
    Socket.connect();
    Socket.emit('join', whiteboardId);
    Socket.on('empty-page-from-server', () => this.drawingEngine.clearBoard(false));
    Socket.on('drawing-data-from-server', (data) => this.drawingEngine.draw(data));
    Socket.on('joined', (data) => this.drawingEngine.addCollaborator(data));
    Socket.on('left', (data) => this.drawingEngine.removeCollaborator(data));
  }

  disconnect () {
    Socket.disconnect();
  }
}

export default connect(null, mapDispatchToProps)(SocketEngine);
