var exec = require('child_process').exec;
var child = exec('dir');  // for windows
// var child = exec('ls -l');  // for linux

child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

child.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
});

child.on('close', function (code) {
    console.log('closing code: ' + code);
});
