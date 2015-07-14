var connect = require('connect'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    morgan = require('morgan'),
    users = require('./users');

var app = connect();

// logger
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

// 注意: 需要先启动redis, 运行redis-server.exe(windows)
// 将session存在redis中
app.use(session({
    store: new RedisStore,
    secret: 'newbie',
    resave: true,
    saveUninitialized: true
}));

// 是否已登陆，否则交给其他中间件
app.use(function (req, res, next) {
    console.log(req.cookies);
    console.log(req.session);
    if (req.url == '/' && req.session.logged_in) {
        res.writeHead(200, {'Context-Type': 'text/html'});
        res.end(
            '<html><body>welcome back, <b>' + req.session.name + '</b>.' +
            '<a href="/logout">Logout</a></body></html>'
        );
    } else {
        next();
    }
});

// 展示登陆表单
app.use(function (req, res, next) {
    if (req.url == '/' && req.method == 'GET' && !req.session.logged_in) {
        res.writeHead(200, {'Context-Type': 'text/html'});
        res.end([
            '<html><body>',
            '<form action="/login" method="POST">',
            '<fieldset>',
            '<legend>Please log in</legend>',
            '<p>User: <input type="text" name="user"></p>',
            '<p>Password: <input type="password" name="password"></p>',
            '<button>Submit</button>',
            '</fieldset>',
            '</form>',
            '</body></html>'
        ].join(''));
    } else {
        next();
    }
});

// 检查登陆表单信信息是否与用户凭证匹配
app.use(function (req, res, next) {
    if (req.url == '/login' && req.method == 'POST') {
        res.writeHead(200);
        if (!users[req.body.user] || req.body.password != users[req.body.user].password) {
            res.end('Bad username/password');
        } else {
            req.session.logged_in = true;
            req.session.name = users[req.body.user].name;
            res.end('Authenticated');
        }
    } else {
        next();
    }
});

// 登出
app.use(function (req, res, next) {
    if (req.url == '/logout') {
        req.session.logged_in = false;
        res.writeHead(200);
        res.end('Logged out!');
    } else {
        next();
    }
})

var server = http.createServer(app);
server.listen(3000);
