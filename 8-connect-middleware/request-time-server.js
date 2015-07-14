var connect = require('connect'),
    http  = require('http'),
    morgan = require('morgan'),
    serveStatic =  require('serve-static'),
    time = require('./request-time');

var app = connect();

//logger
app.use(morgan('dev'));

// check if fast/slow
app.use(time({time: 500}));

// fast response
app.use(function (req, res, next) {
    console.log('hi');
    if ('/a' == req.url) {
        res.writeHead(200);
        res.end('Fast!');
    } else {
        next();
    }
});


// slow response
app.use(function (req, res, next) {
    if ('/b' == req.url) {
        setTimeout( function () {
            res.writeHead(200);
            res.end('Slow!');
        }, 1000);
    } else {
        next();
    }
});

// serve files from within a given root directory
app.use(serveStatic('/website', {redirect: true}));

var server = http.createServer(app);
server.listen(3000);
