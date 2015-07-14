var express = require('express'),
    http = require('http'),
    sio = require('socket.io');

// create app
var app = express();
var server = http.createServer(app);
var io = sio(server);
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
    console.log('Someone connected');

    // when the client emits 'join', this listens and executes
    socket.on('join', function (username) {
        // store the username in the socket session for this client
        socket.username = username;
        // add client's username to global list
        usernames[username] = username;
        ++numUsers;

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    })

    // when the client emits 'message', this listens and executes
    socket.on('message', function (msg) {
        socket.broadcast.emit('message', {
            username: socket.username,
            message: msg
        });
    });

    // when the user disconnets
    socket.on('disconnect', function() {
        // remove username from global usernames list
        delete usernames[socket.username];
        --numUsers;
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
    });
});
