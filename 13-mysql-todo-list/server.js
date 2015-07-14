var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    multer = require('multer'),
    Sequelize = require('sequelize');

var app = express();

var sequelize = new Sequelize('todo-list', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});
// define project model
var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.STRING
});
// define task model
var Task = sequelize.define('Tast', {
    title: Sequelize.STRING
});
// relations
Task.belongsTo(Project);
Project.hasMany(Task, {as: 'Tasks'});

sequelize.sync();
// sequelize.sync({force: true});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function (req, res, next) {
    Project.findAll()
    .then(function (projects) {
        res.render('index', {projects: projects});
    })
    .catch(function (err) {
        next(err);
    });
});

// delete project
app.delete('/project/:id', function (req, res, next) {
    Project.findById(Number(req.params.id)).then(function (project) {
        project.destroy().then(function () {
            res.send(200);
        })
        .catch(function (err) {
            next(err);
        });
    })
});

// create project
app.post('/projects', function (req, res, next) {
    Project.build(req.body).save()
    .then(function (obj) {
        res.send(obj);
    })
    .catch(function (err) {
        next(err);
    });
});

// display project tasks
app.get('/project/:id/tasks', function (req, res, next) {
    Project.findById(Number(req.params.id)).then(function (project) {
        project.getTasks().then(function (tasks) {
            res.render('tasks', {project: project, tasks: tasks});
        })
        .catch(function (err) {
            next(err);
        });
    })
});

// add task to project
app.post('/project/:id/tasks', function (req, res, next) {
    req.body.ProjectId = req.params.id;
    Task.build(req.body).save()
    .then(function (obj) {
        res.send(obj);
    })
    .catch(function (err) {
        next(err);
    })
});

// delelte task
app.delete('/task/:id', function (req, res, next) {
    Task.findById(Number(req.params.id)).then(function (task) {
        console.log(task);
        task.destroy().then(function () {
            res.send(200);
        })
        .catch(function (err) {
            next(err);
        });
    });
});

app.listen(3000, function () {
    console.log('- listening on http://127.0.0.1:3000');
})
