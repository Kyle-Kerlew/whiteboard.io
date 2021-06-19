const {BoardService} = require("../service/board/boardService");

function handleConnection(socket) {
    socket.on("drawing-data", data => {
        socket.to(data.whiteboardId).emit("drawing-data-from-server", data);
        BoardService.updateDrawingData(data.whiteboardId, data);
    });
    socket.on("empty-page", (whiteboardId) => {
        socket.to(whiteboardId).emit("empty-page-from-server");
        BoardService.deleteDrawingData(whiteboardId);
    });
}

module.exports = handleConnection;