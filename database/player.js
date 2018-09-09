const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: String,
    score: 0
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;