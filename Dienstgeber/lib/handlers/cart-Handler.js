//Dependencies
var helpers = require('../helpers');
var _tokens = require('./token-Handler');
var _data = require('../data');
var config = require('../config');
var fs = require('fs');
var path = require('path');

//Private container
var _cart = {};

//Post

_cart.post = function (data, callback) {
	// First verify the Token
	
		var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() :  false;

		var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false; // Rechtschreibung !

		_tokens.verifyToken(tokens, UserName, function (tokenIsValid, tokenData) {
					
			if (!tokenIsValid) {
				callback(403, {'error':'token is invalid'});
			} else {
				
				// look if the items are here
				var allRight = helpers.lookIfeverythingIsallRight(data.payload);

					if (!allRight) {
//						var texscht = fs.readFileSync(helpers.baseDir+'/'+'my'+'.json', 'utf8');
//						console.log(texscht);
						callback(403, {'Error' : 'invalid order' });
						console.log(data);
					}else {
						
						
						// ab hier funktioniert alles
				// create the order
						var orderId = Date.now();
						var orderFileName = helpers.orderName(orderId, UserName);
						var orderData =  {'orderId': orderId, 'items': allRight };
							
						//Create a JSON file for the order
						_data.create('orders', orderFileName, orderData, function(err){
							if (err){
								callback(500, {'Error' : 'Error adding item to the order.'});				
							}
							else{
								console.log(`Order ${orderId} was saved to file: ` + JSON.stringify(orderData));
								callback(200, {'Message' : 'The order was received', 'orderId' : orderId });
							}
						});
					}
			}
	});		
};

//Get

_cart.get = function (data, callback) {
	
	
}


//Del


_cart.delete = function (data, callback) {
	
	
}


module.exports = _cart;