/*
Primäre Datei für die APIs
*/

//Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


var server = http.createServer(function (req,res) {
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
			payload = typeof(payload) == 'objectr' ? payload : {};

			var payloadString = JSON.stringify(payload);
			
			res.writeHead(statusCode);
			res.end(payloadString);

			console.log('Return this response', statusCode, payloadString);
		});		
	});
});

server.listen(3000, function () {
	console.log("Der server läuft");
});

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


