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
						callback(403, {'Error' : 'invalid order' });		
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
	
		var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() :  false;

		var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false; // Rechtschreibung !

		_tokens.verifyToken(tokens, UserName, function (tokenIsValid, tokenData) {
					
			if (!tokenIsValid) {
				callback(403, {'error':'token is invalid'});
			} else {
				
				
				
				_data.listContaining('orders', UserName, function(err, fileList){
					if (!err) {
						// if no orders found
						if (fileList.length == 0) {
							callback(200, {'Message':'There is no order'});
						}
						
						var orderArr =  [];
						var count = 0;
						
						// 
						fileList.forEach(function(fileName){
										
							_data.read('orders', fileName, function(err, orderData){
													
								++count;
								if (err) {
									callback(500, {'Error' :  'Ja heida bimbam da isch a unbekannda fehla' });
									return;
								} else if (orderData != null){
									orderArr.push(orderData);
								}
								//when all orders are processed, return the array
								if (count === fileList.length) {
									callback(200, {'All orders': orderArr});
									return;
								}
							});
						});			
						
						
						
					}  else {
						callback(500, {'Error':'i dont know'});
					}
				});
				
				
			}
	});	
	
};


//Del


_cart.delete = function (data, callback) {
	
		var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() :  false;

		var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false; // Rechtschreibung !

		_tokens.verifyToken(tokens, UserName, function (tokenIsValid, tokenData) {
					
			if (!tokenIsValid) {
				callback(403, {'error':'token is invalid'});
			} else {
				
				var orderId = data.queryStringObject.orderid;

							console.log('Data received: ' + JSON.stringify(data.queryStringObject));
							console.log('Order id validated: ' + orderId);

							if (!orderId) {
								callback(403, {'Error' : 'Order id is missing or not a number.' });
								return;
							}
							
							var orderFileName = helpers.orderName(orderId, UserName);

							//Delete the order file
							_data.delete('orders', orderFileName, function(err)
							{
								if(err) {	
									callback(500, {'Error' : 'Error deleting the order or the order does not exist.'});
									return;
								} else {
									callback(200, {'Message' : 'The order was deleted.'});
									return;
								}
							});
				
			}
	});	
	
}


module.exports = _cart;