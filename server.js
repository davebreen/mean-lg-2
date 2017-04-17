var port = 1337;
var express = require('./expressApp/express');

var http = express();
var database = require('./db/database');

http.listen(port);
module.exports = http;
console.log('Web server running at http://localhost:'+ port);
