var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mysql = require('mysql'),
    config = require('./config');

var app = express();

// logger
app.use(morgan('dev'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extend: true}));

// set template
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// connect mysql
var connect = mysql.createConnection(config);

// route - Index
app.get('/', function (req, res, next) {
    connect.query('SELECT id, title, description FROM item', function (err, results) {
        res.render('index', {items: results});
    });
});

// route - Create
app.post('/create', function (req, res, next) {
    connect.query('INSERT INTO item SET title = ?, description = ?',
        [req.body.title, req.body.description], function (err, result) {
            if (err) return next(err);
            console.log('- item created with id %s', result.insertId);
            res.redirect('/');
        });
});

// route - Items
app.get('/item/:id', function (req, res, next) {
    function getItem (fn) {
        connect.query('SELECT id, title, description From item WHERE id = ? LIMIT 1', [req.params.id], function (err, results) {
            if (err) return next(err);
            if (!results[0]) return res.send(404);
            fn(results[0]);
        });
    }

    function getReviews (item_id, fn) {
        connect.query('SELECT text, stars FROM review WHERE item_id = ?', [req.params.id], function (err, results) {
            if (err) return next(err);
            fn(results);
        });
    }

    getItem(function (item){
        getReviews(item.id, function (reviews) {
            res.render('item', {item: item, reviews: reviews});
        });
    })
});

// rote - Item Comment
app.post('/item/:id/review', function (req, res, next) {
    connect.query('INSERT INTO review SET item_id=?, stars = ?, text = ?',
        [req.params.id, req.body.stars, req.body.text], function (err, result) {
            if (err) return nest(err);
            console.log('- review created with id %s', result.insertId);
            res.redirect('/item/'+ req.params.id);
        });
});

app.listen(3000, function () {
    console.log('- listening on http://127.0.0.1:3000');
});
