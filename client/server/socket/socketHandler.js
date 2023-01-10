import {
    addCollaborator, deleteDrawingData,
    removeCollaborator,
    removeDrawingData,
    updateBoardTitle,
    updateDrawingData
} from "../service/board/boardService";

function handleConnection(socket) {
    socket.on('join', async whiteboardId => {
        console.debug("user joining", whiteboardId)
        const user = socket.handshake.session?.passport?.user;
        console.debug("User has joined the whiteboard", user);
        socket.join(whiteboardId);
        if (user) {
            socket.to(whiteboardId).emit("joined", user);
            addCollaborator(whiteboardId, user);
        }
    });
    socket.on('disconnecting', () => {
        const user = socket.handshake.session?.passport?.user;
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                removeCollaborator(room, user);
                socket.to(room).emit("left", user);
            }
        }

    })
    socket.on("drawing-data", data => {
        socket.to(data.whiteboardId).emit("drawing-data-from-server", data);
        updateDrawingData(data.whiteboardId, data);
    });
    socket.on('undo', data => {

        socket.to(data.whiteboardId).emit("remove-data-from-server", data);
        removeDrawingData(data.whiteboardId, data);
    })
    socket.on("update-title", data => {
        socket.to(data.whiteboardId).emit("update-title", data.title);
        updateBoardTitle(data.whiteboardId, data.title);
    });
    socket.on("empty-page", whiteboardId => {
        socket.to(whiteboardId).emit("empty-page-from-server");
        deleteDrawingData(whiteboardId);
    });
}

export default handleConnection;