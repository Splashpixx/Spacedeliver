/*
INDEX
USER: 28 - 202
Token: 207 - 349
Items : 351 - 500
*/

// <Dependencies>
var _data = require('./data');
var helpers = require('./helpers');
var fs = require('fs');
var path = require('path');
var itemFolder = './data/item';

var _users = require('./handlers/User-Handler');
var _tokens = require('./handlers/token-Handler');
var _menu = require('./handlers/Menu-Handler');		//@TODO
var _cart = require('./handlers/cart-Handler');
var _purchase = require('./handlers/purchase-Handler');


// </Dependencies>


//Handlers
var handlers = {};

handlers.users = function (data,callback) {
	var acceptableMethodes = ['post','get','put','delete'];
	
	if (acceptableMethodes.indexOf(data.method) > -1) {
		_users[data.method](data,callback);
	} else {
		callback(405); 
	}
};

handlers.tokens = function (data,callback) {
	var acceptableMethodes = ['post','get','put','delete'];
	
	if (acceptableMethodes.indexOf(data.method) > -1) {
		_tokens[data.method](data,callback);
	} else {
		callback(405); 
	}
};

handlers.menu = function(data,callback){
	var acceptableMethods = ['get'];
	if(acceptableMethods.indexOf(data.method) > -1){
		_menu[data.method](data,callback);
	} else {
		callback(405);
	}
};

handlers.cart = function(data,callback){
	var acceptableMethods = ['post','get','delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		_cart[data.method](data,callback);
	} else {
		callback(405);
	}
};

handlers.purchase = function(data,callback){
	var acceptableMethods = ['post'];
	if(acceptableMethods.indexOf(data.method) > -1){
		_purchase[data.method](data,callback);
	} else {
		callback(405);
	}
};


// Ping handler um zu schauen ob die app noch lebt oder gestorben ist
handlers.ping = function (data,callback) {
	callback(200); 
};

handlers.notFound = function (data,callback) {
	callback(404);
};

// Export
module.exports = handlers;