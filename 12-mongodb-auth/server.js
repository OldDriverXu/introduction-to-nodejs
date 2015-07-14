var express = require('express'),
    mongodb = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
    bodyParser = require('body-parser'),
    multer = require('multer');
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    morgan = require('morgan');


var app = express();

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

app.use(function (req, res, next) {
    if (req.session.loggedIn) {
        res.locals.authenticated = true;
        app.users.findOne({_id: ObjectID(req.session.loggedIn)}, function (err, result) {
            if (err) return next(err);
            res.locals.me = result;
            next();
        });
    } else {
        res.locals.authenticated = false;
        next();
    }
});

// set template
app.set('view engine', 'jade');
if (app.get('env') == 'production') {
    // app.enable('view cache');
}
app.set('views', __dirname + '/views')

// routing
app.get('/', function (req, res) {
    // res.render('index', {authenticated: false});
    console.log(res.locals);
    res.render('index');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/signup', function (req, res) {
    res.render('signup');
});

app.listen(3000, function () {
    console.log('\033[96m +  \033[39m app listening on *:3000');
});

// connect to db
var server = new mongodb.Server('127.0.0.1', 27017, {safe: true});
var db = new mongodb.Db('my-website', server, {safe: true});
db.open(function (err, client) {
    if (err) throw err;
    console.log('\033[96m + \033[39m connected to mongodb');
    app.users = new mongodb.Collection(client, 'users');

    // index 确保在查询前建立了索引
    client.ensureIndex('users', 'email', function (err) {
        if (err) throw err;
        client.ensureIndex('users', 'password', function (err) {
            if (err) throw err;
            console.log('\033[96m + \033[39m ensured indexed');
        });
    });
});

app.post('/signup', function (req, res, next) {
    app.users.insert(req.body.user, function (err, result) {
        if (err) return next(err);
        console.log(result);
        res.redirect('/login/' + req.body.user.email);
    });
});

app.get('/login/:signupEmail', function (req, res) {
    res.render('login', {signupEmail: req.params.signupEmail});
});

app.post('/login', function (req, res) {
    app.users.findOne({ email: req.body.user.email, password: req.body.user.password}, function (err, result) {
        if (err) return next(err);
        if (!result) return  res.send('<p>User not found. Go back and try again!</p>');
        req.session.loggedIn = result._id.toString();

        res.redirect('/');
    });
});

app.get('/logout', function (req, res) {
    req.session.loggedIn = null,
    res.redirect('/');
});


