var cp = require('child_process');

var n = cp.fork(__dirname + '/child.js');

// 获取子进程返回的信息
n.on('message', function (m) {
    console.log('Parent got message: ', m);
});

// 向子进程发送信息
n.send({ hello: 'world'});
