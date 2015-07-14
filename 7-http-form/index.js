var qs = require('querystring'),
    http = require('http');

http.createServer(function (req, res) {
    if (req.url == '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(['<form method="POST" action="/url">',
            '<h1>My form</h1>',
            '<fieldset>',
            '<label>Personal information</label>',
            '<p>What is your name?</p>',
            '<input type="text" name="name">',
            '<p><button>Submit</button></p>',
            '</fieldset>',
            '</form>'].join(''));
    } else if (req.url == '/url' && req.method == 'POST') {
        var body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            res.writeHead(200, {'Content-Type': 'text/html'});
            // res.end('<p>Content-Type: ' + req.headers['content-type'] + '</p>' +
            //         '<p>Data:</p><pre>' + body + '</pre></p>' +
            //         '<p>You send a <em>' + req.method + '</em> request</p>');
            res.end('<p>Your name is <b>' + qs.parse(body).name + '</b></p>');
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
}).listen(3000);
