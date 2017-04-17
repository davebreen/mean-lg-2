var express = require('express');
var path = require('path')
var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function() {
    var app = express();
    app.use(express.static('static'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    require('./routes.js')(app);
    return app;
};
