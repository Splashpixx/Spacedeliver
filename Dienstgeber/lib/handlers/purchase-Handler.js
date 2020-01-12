//Dependencies

var helpers = require('../helpers');
var _tokens = require('./token-Handler');
var _data = require('../data');
var config = require('../config');
var https = require('https');
var querystring = require('querystring');

// container

_purchase = {};

_purchase.post = function (data,callback) {
	
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() :  false;
	var Email = typeof(data.queryStringObject.Email) == 'string' && data.queryStringObject.Email.trim().length > 8 ? data.queryStringObject.Email.trim(): false;
	
	var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false; // Rechtschreibung !

	_tokens.verifyToken(tokens, UserName, function (tokenIsValid, tokenData) {
				
		if (!tokenIsValid) {
			callback(403, {'error':'token is invalid'});
		} else {
			// check if everything is in the payload
			
			var orderId = data.headers.orderid;
			var order = data.payload
			
			if (!orderId && !order) {
				callback(500, {'Error':'Either orderId header or order in payload has to be sent.'})
			}
			
			var orderFileName = helpers.orderName(orderId, UserName);
			
			// Choose what param to put into the promise
			var param = (orderId) ? { 'orderId': orderId, 'orderFileName': orderFileName } : order;
			var getOrderDataPromise = getOrderFromId(param);
			
			console.log(getOrderDataPromise); // OrderData
			
			getOrderFromId(param).then(function (orderData) {
			
				
				// nachdem wir die Order daten kaben können wir dafür bezahlen
				processOrder(Email, orderData, function (err){
					if (err) {
						callback(400, {'Error':'Problem  with the Payment'});
					} else {
						
						//Del order file
						if (orderId) {
							_data.delete('orders', orderFileName, function(err)
							{
								if(err) {	
									console.log('Error deleting the order or the order does not exist')
								} else {
									console.log('The order was deleted');
								}
							});
						}// finish Del
						callback(200, {'Message':'Your  payment was recived'});
					} // end else
				});
	
		}) 
		.catch(function (error) {
				callback(500, { 'Error': error });
			     });
	}});
}; 
		


// Promise knowledge = https://javascript.info/promise-basics

const getOrderFromId = function (data) {

				return new Promise(function (resolve, reject) {

					var orderId = data.orderId;
					var orderFileName = data.orderFileName;

					console.log(orderId,orderFileName);
					
					_data.read('orders', orderFileName, function (err, fullOrderData) {

						if (err || fullOrderData == null) {
							reject('Error reading the order or order id is invalid.');
						} else {

							orderData = helpers.lookIfeverythingIsallRight(fullOrderData.items);
							if (orderData) {
								resolve(orderData);
								console.log('this works');
							} else {
								reject('Error reading the order. Please make an order using the payload.');
							}
						}
					});
				});
			};


const processOrder = function (receiverEmail, order, callback) {

// In the test mode, use developer's email to send the receipt
	
	var receiver = receiverEmail;
	var bill = calculateBill(order);
	
	var orderPayload = createOrderPayload(bill, receiver);
	
	var orderDetails = createStripeRequest(orderPayload);
	

	purchase(orderDetails, orderPayload, function (err) {
		if (err) {
			callback(true);
		} else {
			callback(false);

			// If the payment was accepted, send the receipt via email
			var sender = 'sandbox0d32ac152b8f468c9a4145814b6056a9.mailgun.org';

			sendReceipt(sender, receiver, "Spacedeliver order", bill.desc, function (err) {
				if (err) {
						console.log('Error while sending receipt: ' + err);
				} else {
						console.log('Sent receipt.');
				}
			});
			console.log('ENDE');
		} 
	});
};

const purchase = function (orderDetails, orderPayload, callback) {
	
	console.log('\nTrying to charge a card via Stripe...\n');
	
	if (orderDetails && orderPayload) {
		var req = https.request(orderDetails, function (res) {
		
			if (200 == res.statusCode || 201 == res.statusCode) {
				callback(false);
			} else {
				callback(500);
			}
		});
		
		req.on('error', function (e) {
			console.log(e);
		});
		
		req.write(orderPayload);
		req.end();

	} else {
		callback('Missing required field or field invalid.');
	}
};

const sendReceipt = function (sender, receiver, subject, message, callback) {
	console.log(`\nTrying to send a receipt from ${sender} to ${receiver}.\n`);

	// Validate fields
	sender = 'sandbox0d32ac152b8f468c9a4145814b6056a9.mailgun.org';
	receiver = helpers.validateEmail(receiver);
//	subject = helpers.validateString(subject);
//	message = helpers.validateString(message);
//	console.log(sender, receiver, subject, message, callback);
	if (sender && receiver && subject && message) {

		// Create the request payload
		const payload = {
			from: sender,
			to: receiver,
			subject: subject,
			text: message
		};

		// Stringify the payload
		var stringPayload = querystring.stringify(payload);
	
		console.log("\nMail payload:\n" + stringPayload + "\n");

		// Configure the request details
		const requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.eu.mailgun.net',
			'method': 'post',
			'path': `/v2/sandbox0d32ac152b8f468c9a4145814b6056a9.mailgun.org/messages`,
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload),
				'Authorization': 'Basic ' + Buffer.from('api:' + 'd5aa21e653903c11cfc38c6a58471437-713d4f73-84ab0eb2', 'utf8').toString('base64')
			}
		};
			
		// Instantiate the request object
		var req = https.request(requestDetails, function (res) {

			res.on('data', function (data) {
					console.log("\nData from MailGun:\n" + data + "\n");
			});
				console.log('This !\n',res.statusCode);
				
			res.on('end', function () {
				var status = res.statusCode;
				
				if (status === 200 || status === 201) {
					callback(false);
				} else {
					callback('Status code returned was ' + status, JSON.stringify(res.headers));
				}
			});
		});
		
		// In case of an error, bubble it up
		req.on('error', function (error) {
			
			callback(error);
		});
		
		// Add the payload
		req.write(stringPayload);
		req.end();
		
	} else {
		
		callback(`Error: Missing required field. Input data:\nSender: ${sender}\nReceiver: ${receiver}\nSubject: ${subject}\nMessage: ${message}\n`);
	}
};

// Returns tuple of { charge : number, desc : string }
const calculateBill = function (order) {
	var menu = helpers.getStuff(); 
	
	console.log(`\nThe following order was made :\n${JSON.stringify(order)}\n`);

	var sum = 0.0;
	var desc = "Your order: ";

	for (var i = 0; i < order.length; ++i) {
		
		var Space = menu.find(Space => Space.Id === order[i].id);
	
		if (Space == undefined) //ignore items with unknown ids
			continue;

		var totalPrice = order[i].amount * Space.Price;
		
		desc += `\n${order[i].amount} * ${Space.Name} (${Space.Price.toFixed(2)}) = ${totalPrice.toFixed(2)}`;
		sum += totalPrice;
	};

	console.log(`\nThe bill:\n${desc}\n`);
	return {
		charge: (sum * 100).toFixed(0), //return the price in cents, set precision to 0
		desc: desc
	};
}


const createOrderPayload = function (bill, email) {
	
	var payload = {
		'currency': 'EUR',
		'source': 'tok_visa',
		'amount': bill.charge,
		'description': bill.desc,
		'receipt_email': email,
	};
	
	// Stringify the payload
	return querystring.stringify(payload);
};

const createStripeRequest = function (content) {

	console.log(`\nSending request to Stripe:\n${content}\n`);
	
	var requestDetails = {
		'protocol': 'https:',
		'hostname': 'api.stripe.com',
		'method': 'POST',
		'path': '/v1/charges',
		'headers':
		{
			'Authorization':  'Bearer sk_test_BwhGkY4CmbOahCD3NdgkbZkZ00pJXCwPrB',
			'Content-Length': Buffer.byteLength(content),
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	
	return requestDetails;
};


//export
module.exports = _purchase;

// nochmal zum nachlesen Ternary = https://codeburst.io/javascript-the-conditional-ternary-operator-explained-cac7218beeff