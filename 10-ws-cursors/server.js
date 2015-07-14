var express = require('express'),
    http = require('http'),
    wsio = require('websocket.io');

// create express app
var app = express();
var server = http.createServer(app).listen(3000);

// attach websocket server
var ws = wsio.attach(server);

app.use(express.static('public'));

var positions = {},
    total = 0;
ws.on('connection', function (socket) {
    // give the socket an id
    socket.id = ++total;
    // send the positons of everyone else
    socket.send(JSON.stringify(positions));

    socket.on('message', function (msg) {
        try {
            var pos = JSON.parse(msg);
        } catch (e) {
            return;
        }
        positions[socket.id] = pos;
        // 广播
        broadcast(JSON.stringify({type: 'position', pos: pos, id: socket.id}));
    });

    socket.on('close', function () {
        delete positions[socket.id];
        // 广播
        broadcast(JSON.stringify({type: 'disconnect', id: socket.id}));
    });

    function broadcast (msg) {
        console.log(ws.clients);
        for (var i = 0, imax = ws.clients.length; i < imax; i++) {
            // avoid sending a message to the same socket that broadcasts
            if (ws.clients[i] && socket.id != ws.clients[i].id) {
                ws.clients[i].send(msg);
            }
        }
    }
});
