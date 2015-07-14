var express = require('express'),
    search = require('./search');

// create app
var app = express();

// app settings
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

if (app.get('env') == 'production') {
    app.enable('view cache');
}

console.log(app.get('views'));

// app router
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/search', function (req, res) {
    search(req.query.keyword, function (err, videos) {
        if (err) return next(err);
        res.render('search', {results: videos, search: req.query.keyword});
    });
});

// app listen
app.listen(3000);
