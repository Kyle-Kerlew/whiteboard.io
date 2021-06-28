const express = require('express');
const router = express.Router();
const {BoardService} = require('../../service/board/boardService');

router.get('/read/:whiteboardId', async function (req, res) {
    const response = await BoardService.findWhiteboardById(req.params.whiteboardId);
    res.json(response);
});

router.get('/count', async function (req, res) {
    const response = await BoardService.countWhiteboards();
    res.json({count: response});
});

router.post('/create', async function (req, res) {
    const response = await BoardService.createWhiteboard(req.session.passport?.user?.email);
    res.json(response); //mongodb response
});

module.exports = router;