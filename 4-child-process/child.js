// 子进程

process.on('message', function (m) {
    console.log('Child got message: ', m);
});

process.send({foo: 'bar'});
