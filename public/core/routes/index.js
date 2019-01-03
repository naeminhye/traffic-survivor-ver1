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

router.get('/instruction', (req, res) => {
    console.log('Request to pages/instruction')
    res.render('pages/instruction');
});

router.get('/options', (req, res) => {
    console.log('Request to pages/options')
    res.render('pages/options');
});

router.get('/about', (req, res) => {
    console.log('Request to pages/about')
    res.render('pages/about');
});

router.get('/game', function(req, res, next) {
    console.log('Request to pages/game')
    res.render('pages/game', { level : req.query.level, chapter : req.query.chapter });
});

module.exports = router;