var http = require('http'),
    fs = require('fs');

var server = http.createServer(function (req, res) {
    if (req.method == 'GET' && req.url.substr(0,7) == '/images' && req.url.slice(-4) == '.jpg') {
        fs.stat(__dirname + req.url, function (err, stat) {
            if ( err || !stat.isFile()) {
                res.writeHead(404);
                res.end('Not Found');
            }
            serve(__dirname + req.url, 'application/jpg');
        });
    } else if (req.method == 'GET' && req.url == '/') {
        serve(__dirname + '/index.html', 'text/html');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }

    function serve(path, type) {
        res.writeHead(200, {'Content-Type': type});
        fs.createReadStream(path).pipe(res);
    }
});

// server.listen(3000);

module.exports = server;
