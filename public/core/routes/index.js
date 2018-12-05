const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log('Request to pages/index')
    res.render('pages/index');
});

router.get('/levels', (req, res) => {
    console.log('Request to pages/levels')
    res.render('pages/levels');
});

router.get('/game', function(req, res, next) {
    console.log('Request to pages/game')
    res.render('pages/game', { chapter : req.query.chapter });
});

module.exports = router;