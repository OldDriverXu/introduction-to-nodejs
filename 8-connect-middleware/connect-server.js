var connect = require('connect'),
    http = require('http'),
    serveStatic =  require('serve-static');

var app = connect();
    server = http.createServer(app);

// static files
app.use(serveStatic(__dirname + '/website'));
server.listen(3000);
