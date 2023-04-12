const express = require('express');
const router = express.Router();
const {BoardService} = require('../../service/board/boardService');

router.get('/read/:whiteboardId', async function (req, res) {
    const board = await
        BoardService.findWhiteboardById(req.params.whiteboardId, req.session.passport?.user)

    if (board.strokes.length > 0) {
        board.data = undefined;
    } else {
        board.strokes = undefined;
    }
    res.json(board);
});

router.get('/count', async function (req, res) {
    const response = await BoardService.countWhiteboards();
    res.json({count: response});
});

router.post('/create', async function (req, res) {
    const response = await BoardService.createWhiteboard(req.session.passport?.user);
    res.json(response); //mongodb response
});

module.exports = router;
