var net = require('net');

var count = 0,
    users = {};

var server = net.createServer(function (conn) {
    // handle connection
    console.log('\033[90m new connection! \033[39m');

    conn.setEncoding('utf8');

    var nickname;

    conn.write(
        '\r\n > welcome to \033[92m node-chat \033[39m!' +
        '\r\n > ' + count + ' other people are connected at this time.' +
        '\r\n > please write your name and press enter: '
    );
    count++;

    var data = '';
    conn.on('data', function (chuck) {
        if (chuck == '\r\n'){
            // 删除回车符
            // data = data.replace('\r\n', '');
            if (!nickname) {
                if (users[data]) {
                        data = '';
                        conn.write('\033[93m> nickname already in use. try again: \033[39m ');
                        return;
                } else {
                    nickname = data;
                    users[nickname] = conn;
                    broadcast('\033[90m \r\n > ' + nickname + ' joined the room\033[39m \r\n');
                }
            } else {
                // 视为聊天消息
                broadcast('\033[96m \r\n > ' + nickname + ':\033[39m ' + data + '\r\n', true);
            }
            //
            data = '';
        } else {
            data += chuck;
        }
    });

    conn.on('close', function () {
        count--;
        delete users[nickname];
        broadcast('\033[90m \r\n > ' + nickname + ' left the room \033[39m\r\n');
    });

    function broadcast (msg, exceptMyself) {
        for (var i in users) {
            if (!exceptMyself || i != nickname) {
                users[i].write(msg);
            }
        }
    }
});

server.listen(3000, function () {
    console.log('\033[96m server listen on *:3000 \033[39m');
});
