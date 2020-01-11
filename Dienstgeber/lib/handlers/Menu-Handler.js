//Dependencies
var helpers = require('../helpers');
var _tokens = require('./token-Handler');
var _data = require('../data');
var config = require('../config');
var fs = require('fs');
var path = require('path');

//Private container
_menu = {};

_menu.baseDir = path.join(__dirname,'/..');
// Menu - GET
// Required header: token
_menu.get = function(data, callback){
	
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() :  false;
	
	var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false;

	// Verify that the given token is valid for the email
	_tokens.verifyToken(tokens, UserName, function(tokenIsValid){
	
		if (tokenIsValid){
			// Output the Json File
			fs.readFile(_menu.baseDir+'/'+'my'+'.json', 'utf8', function (err, data) {
				console.log(data);
				callback(200,{'Stuff' : data } ); // WHY
			});			
			

		} else {
			callback(400);		
		}
	});
};


module.exports = _menu;