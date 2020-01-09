/*
Primäre Datei für die APIs
*/


// Dipendencies
var server = require('./lib/server');


// declare the app
var app = {};


app.init = function () {
	//start server
	server.init();
}

// execute
app.init();

// export app
module.exports = app;


