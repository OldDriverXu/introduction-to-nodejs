/*
 * GET home page.
 */
var Movie = require('../models/Movie');


exports.index = function (req, res) {
    res.render('index', {title: 'Index', message: res.locals.message});
};

exports.login = function (req, res) {
    res.render('login', {title: '用户登陆', message: res.locals.message});
};

exports.doLogin = function (req, res) {
    var user = {
        username: 'admin',
        password: 'admin'
    };

    if (req.body.username === user.username && req.body.password === user.password) {
        req.session.user = user;
        return res.redirect('/home');
    } else {
        req.session.error = '用户名或者密码不正确';
        return res.redirect('/login');
    }
};

exports.logout = function (req, res) {
    req.session.user = null;
    res.redirect('/');
};

exports.home = function (req, res) {
    res.render('home', {title: 'Home', user: req.session.user});
};

exports.movie = function (req, res) {
    Movie.findAll(10, function (err, result){
        res.render('movielist', {title: "MovieList", movies: result});
    });
}
