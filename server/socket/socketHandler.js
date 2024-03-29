const {BoardService} = require("../service/board/boardService");

function handleConnection(socket) {
    socket.on('join', async whiteboardId => {
        const user = socket.handshake.session?.passport?.user;
        socket.join(whiteboardId);
        if (user) {
            socket.to(whiteboardId).emit("joined", user);
            BoardService.addCollaborator(whiteboardId, user);
        }
    });
    socket.on('disconnecting', () => {
        const user = socket.handshake.session?.passport?.user;
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                BoardService.removeCollaborator(room, user);
                socket.to(room).emit("left", user);
            }
        }

    })
    socket.on("drawing-data", data => {
        socket.to(data.whiteboardId).emit("drawing-data-from-server", data);
        BoardService.updateDrawingData(data.whiteboardId, data);
    });
    socket.on('undo', data => {
        socket.to(data.whiteboardId).emit("remove-data-from-server", data);
        BoardService.removeDrawingData(data.strokeId);
    })
    socket.on("update-title", data => {
        socket.to(data.whiteboardId).emit("update-title", data.title);
        BoardService.updateBoardTitle(data.whiteboardId, data.title);
    });
    socket.on("empty-page", whiteboardId => {
        socket.to(whiteboardId).emit("empty-page-from-server");
        BoardService.deleteDrawingData(whiteboardId);
    });
}

module.exports = handleConnection;
