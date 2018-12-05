var express = require('express');
var app = express();
var http = require('http');
const path = require("path")
const routes = require('./public/core/routes')
// var io = require('socket.io')(http);
// var mongoose = require('mongoose');

app.set('views', path.join(__dirname, '/public/core/views'))
// set the view engine to ejs
app.set('view engine', 'ejs');
 
app.use('/', routes)

app.use(express.static(__dirname + '/public'));
// Set the folder for css & java scripts
// app.use(express.static(path.join(__dirname,'./public')))

// app.get('/', function(req, res) {
//   res.render('core/views/pages/index');
// });

// app.get('/levels', function(req, res) {
//   res.render('core/views/pages/levels');
// });

// var firebase = require("firebase-admin");

// var serviceAccount = require("./serviceAccountKey.json");

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://traffic-survivor.firebaseio.com"
// });

// var db = firebase.database();
// var ref = db.ref("restricted_access/secret_document");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

// var usersRef = ref.child("test");
// usersRef.set({
//   last_login: new Date()
// });

// mongoose.connect('mongodb://13.231.255.77/traffic-survivor', { useNewUrlParser: true });
// //Ép Mongoose sử dụng thư viện promise toàn cục
// mongoose.Promise = global.Promise;

// mongoose.connection.once('open', function() {
//     console.log("[Success] Database connected.");
// }).on('error', function(e) {
//     console.log("[Error]", e);
// })

// Handle connection
// io.on('connection', function(socket){
    // console.log('a user connected');

    // var id = socket.id;
    // world.addPlayer(id);

    // var player = world.playerForId(id);
    // socket.emit('createPlayer', player);

    // socket.broadcast.emit('addOtherPlayer', player);

    // socket.on('requestOldPlayers', function(){
    //     for (var i = 0; i < world.players.length; i++){
    //         if (world.players[i].playerId != id)
    //             socket.emit('addOtherPlayer', world.players[i]);
    //     }
    // });
    // socket.on('updatePosition', function(data){
    //     var newData = world.updatePlayerData(data);
    //     socket.broadcast.emit('updatePosition', newData);
    // });
    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    //     io.emit('removeOtherPlayer', player);
    //     world.removePlayer( player );
    // });

// });

// Handle environment changes
// var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
// var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 
// http.listen(port, ip_address, function(){
//     console.log( "Listening on " + ip_address + ", server_port " + port );
// });

var server = http.createServer(app);

server.listen(process.env.PORT || 3000, function(){
   console.log('listening on *: 3000');
});
