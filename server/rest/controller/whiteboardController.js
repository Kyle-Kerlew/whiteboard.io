const express = require('express');
const router = express.Router();
const {BoardService} = require('../../service/board/boardService');

router.get('/read/:whiteboardId', async function (req, res) {
    const response = await BoardService.findWhiteboardById(req.params.whiteboardId);
    console.log(response);
    res.json(response);
});

router.get('/count', async function (req, res) {
    const response = await BoardService.countWhiteboards();
    console.log(response);
    res.json({count: response});
});

router.post('/create', async function (req, res) {
    const response = await BoardService.createWhiteboard(req.body);
    res.json(response); //mongodb response
});

module.exports = router;