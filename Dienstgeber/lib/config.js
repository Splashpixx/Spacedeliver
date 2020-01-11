/*
Create and export config var's
*/
var path = require('path');

// container
var enviroments = {};

// Staging (default) enviroment
enviroments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
	'hashingSecret' : 'Is-There_enough-SpaceTo-Deliver',
	'stripe': {
			'publicKey': 'XXX',
			'secretKey': 'XXX',
			'currency': 'EUR',
			'currencySign': '€',
			'source': 'tok_visa'
		},
	'mailGun': {
			'hostname': 'api.eu.mailgun.net', //european endpoint
			'domain': 'sandboxXXX.mailgun.org',
			'apiKey': 'key-XXX',
			'senderMail': ''
		}
};

// Production enviroment
enviroments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret' : 'Is-There_enough-SpaceTo-Deliver',
	'stripe': {
			'publicKey': 'XXX',
			'secretKey': 'XXX',
			'currency': 'usd',
			'currencySign': '$',
			'source': 'tok_visa'
		},
		//To be changed in real-life solution, but never to be published
	'mailGun': {
			'hostname': 'api.mailgun.net', //us endpoint
			'domain': 'sandboxXXX.mailgun.org',
			'apiKey': 'key-XXX', //unescape the chars?
			'senderMail': ''
		}
};

// Determine wich envi was passed as a command line argument
var currentEnviroment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not default to stating
var enviromentToExport = typeof (enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// Export 
module.exports = enviromentToExport;
