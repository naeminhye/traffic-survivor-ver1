const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log('Request for home recieved')
    res.render('pages/index');
});

router.get('/levels', (req, res) => {
    console.log('Request for home recieved')
    res.render('pages/levels');
});

router.get('/game', function(req, res, next) {
    res.render('pages/game', {chapter : req.query.chapter});
});

module.exports = router;