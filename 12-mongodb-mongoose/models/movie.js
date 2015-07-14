// DB Connection
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId;

mongoose.connect('mongodb://localhost/movie');

var MovieSchema = new Schema({
    name: String,
    alias: [String],
    publish: Date,
    create_date: {type: Date, default: Date.now},
    images: {
        coverSmall: String,
        coverBig: String
    },
    source: [{
        source: String,
        link: String,
        swfLink: String,
        quality: String,
        lang: String,
        subtitle: String,
        create_date: {type: Date, default: Date.now}
    }]
});

var MovieModel = mongoose.model('Movie', MovieSchema);

// Movie Object
var Movie = function () {};

Movie.prototype.save = function (obj, callback) {
    var instance = new MovieModel(obj);
    instance.save(function (err) {
        callback(err);
    });
};

Movie.prototype.findAll = function (limits, callback) {
    var limits = limits || 10;
    MovieModel.find().limit(limits).exec(callback);
}

Movie.prototype.findByIdAndUpdate = function (obj, callback) {
    var _id = obj._id;
    delete obj._id;
    MovieModel.findOneAndUpdate(_id, obj, function (err, result) {
        callback(err, result);
    });
};

Movie.prototype.findByName = function (name, callback) {
    MovieModel.findOne({name: name}, function (err, result) {
        callback(err, result);
    });
};

module.exports = new Movie();
