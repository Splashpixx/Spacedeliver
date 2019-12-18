/*
Primäre Datei für die APIs
*/

//Das gleiche wie #Include in C
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config'); //dont need to tell Node that config is js
var fs = require('fs');

var httpServer = http.createServer(function (req,res) {
	unifiedServer(req, res);
});

//. iniziiert den server
httpServer.listen(config.httpPort, function () {
	console.log("Der server läuft auf " +config.httpPort);
});

//um zu einem https server din zu werden brauchen wir unseren privat key
var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert' :	fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function (req,res) {
	unifiedServer(req, res);
});
//
httpsServer.listen(config.httpsPort, function () {
	console.log("Der server läuft auf " +config.httpsPort);
});

//server logic für http und https
var unifiedServer = function (req,res) {
	var parsedUrl = url.parse(req.url,true); 
	
	// Get path | pathname das ende eines request (ohne http300 ....)
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	var queryStringObject =  parsedUrl.query;

	var method  = req.method.toLowerCase();
	
	var headers  = req.headers;

	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function (data) {
		buffer += decoder.write(data);
	}); //4.00
	req.on('end', function () {
		buffer += decoder.end();
		
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

		chosenHandler(data, function (statusCode,payload) {
			
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;		
			payload = typeof(payload) == 'object' ? payload : {};

			var payloadString = JSON.stringify(payload);
			
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			console.log('Return this response', statusCode, payloadString);
		});		
	});
};

var handlers = {};

handlers.sample = function (data,callback) {
	callback(406,{'name' : 'sample handler'});
};

handlers.notFound = function (data,callback) {
	callback(404);
};

var router =  {
	'sample' : handlers.sample
};

//cmd+k  = clear


