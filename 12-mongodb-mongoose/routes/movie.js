var Movie = require('../models/Movie');

exports.movieAdd = function (req, res) {
    if (req.params.name) { // update
        return res.render('movie', {
            title: req.params.name + '|电影|管理|电影天堂',
            label: '编辑电影:' + req.params.name,
            movie: req.params.name
        });
    } else {
        return res.render('movie', {
            title: '新增|电影|管理|电影天堂',
            label: '新增电影',
            movie: null
        });
    }
};

exports.doMovieAdd = function (req, res) {
    console.log(req.body.content);
    var json = req.body.content;
    if (json._id){ // update
        Movie.findByIdAndUpdate(json, function (err, result) {
            if (err) {
                res.send({'success': false, 'err': err});
            } else {
                res.send({'success': true});
            }
        });
    } else {
        Movie.save(json, function (err) {
            if (err) {
                res.send({'success': false, 'err': err});
            } else {
                res.send({'success': true});
            }
        });
    }
};

exports.findMovieByName = function (req, res) {
    Movie.findByName(req.params.name, function (err, result) {
        if (err) { console.log(err);}
        if (result) {
            res.send(result);
        } else {
            res.send("No data");
        }
    });
}
