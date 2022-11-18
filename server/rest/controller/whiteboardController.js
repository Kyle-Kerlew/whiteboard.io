const express = require('express');
const router = express.Router();
const {BoardService} = require('../../service/board/boardService');

router.get('/read/:whiteboardId', async function (req, res) {
    const [board, response2] = await Promise.all([
        BoardService.findWhiteboardById(req.params.whiteboardId, req.session.passport?.user),
        BoardService.findStrokesByWhiteboardId(req.params.whiteboardId)
    ]);
    if ((await response2.count()) === 0) {
        board.data = [];
    } else {
        board.data = [];
        await response2.forEach(item => {
            board.data.push(...item.subpath)
        });
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
