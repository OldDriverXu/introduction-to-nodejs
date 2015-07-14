var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    routes = require('./routes/index'),
    movie = require('./routes/movie'),
    user = require('./routes/user');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// logger
app.use(morgan('dev'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse multipart/form-data
app.use(multer());
// cookie
app.use(cookieParser());
// session
app.use(session({secret: 'newbie'}));
// serve static
app.use(express.static(__dirname + '/public'));
// login session
app.use(function (req, res, next) {
    if (req.session.username) {
        res.locals.user = req.session.username;
    }
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) {res.locals.message = '<div class="alert alert-error">' + err + '</div>';}
    next();
});

app.get('/', routes.index);

app.all('/login', notAuthenticated);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);

app.get('/logout', authenticated);
app.get('/logout', routes.logout);

app.get('/home', authenticated);
app.get('/home', routes.home);

app.get('/movie', authenticated);
app.get('/movie', routes.movie);

app.get('/users', authenticated);
app.get('/users', user.list);

//mongo
app.get('/movie/add', movie.movieAdd);
app.post('/movie/add', movie.doMovieAdd);
app.get('/movie/:name', movie.movieAdd);
app.get('/movie/find/:name', movie.findMovieByName);

function notAuthenticated(req, res, next) {
    if (req.session.user) {
        req.session.error = '已登录';
        return res.redirect('/');
    }
    next();
}

function authenticated(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请先登录';
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function () {
    console.log('- Server listening on http://127.0.0.1:3000');
})
