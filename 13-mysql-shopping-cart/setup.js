var mysql = require('mysql'),
    config = require('./config');

delete config.database;
var connect = mysql.createConnection(config);

// create database
connect.query('CREATE DATABASE IF NOT EXISTS `shopping-cart`');
connect.query('USE `shopping-cart`');

// create tables
connect.query('DROP TABLE IF EXISTS `item`');
connect.query('CREATE TABLE item (' +
    'id INT(11) AUTO_INCREMENT,' +
    'title VARCHAR(255),' +
    'description TEXT,' +
    'created DATETIME,' +
    'PRIMARY KEY (id))');

connect.query('DROP TABLE IF EXISTS `review`');
connect.query('CREATE TABLE review (' +
    'id INT(11) AUTO_INCREMENT,' +
    'item_id INT(11),' +
    'text TEXT,' +
    'stars INT(1),' +
    'created DATETIME,' +
    'PRIMARY KEY (id))');

// terminate connection
connect.end(function (err){
    process.exit();
    console.log(err);
});
