var express = require('express'),
    http = require('http'),
    wsio = require('websocket.io');

// create express app
var app = express();
var server = http.createServer(app).listen(3000);

// attach websocket server
var ws = wsio.attach(server);

// serve code
app.use(express.static('public'));

// listening on connections
ws.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log(' \033[96m got:\033[39m' + msg);
        socket.send('pong');
    });
});
