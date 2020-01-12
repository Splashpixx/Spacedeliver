/*
Create and export config var's
*/
var path = require('path');

// container
var enviroments = {};
var config = {};

// Staging (default) enviroment
enviroments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
	'hashingSecret' : 'Is-There_enough-SpaceTo-Deliver',
	'stripe': {
			'publicKey': 'pk_test_eapLY31Dyk9jTICKdSURDDvD00MfTgcMe6',
			'secretKey': 'sk_test_BwhGkY4CmbOahCD3NdgkbZkZ00pJXCwPrB',
			'currency': 'EUR',
			'currencySign': '€',
			'source': 'tok_visa'
		},
	'mailGun': {
			'hostname': 'api.eu.mailgun.net', //european endpoint
			'domain': 'sandboxXXX.mailgun.org',
			'apiKey': 'd5aa21e653903c11cfc38c6a58471437-713d4f73-84ab0eb2',
			'senderMail': 'sandbox0d32ac152b8f468c9a4145814b6056a9.mailgun.org'
		}
};

// Production enviroment
enviroments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret' : 'Is-There_enough-SpaceTo-Deliver',
	'stripe': {
			'publicKey': 'pk_test_eapLY31Dyk9jTICKdSURDDvD00MfTgcMe6',
			'secretKey': 'sk_test_BwhGkY4CmbOahCD3NdgkbZkZ00pJXCwPrB',
			'currency': 'EUR',
			'currencySign': '€',
			'source': ' '
		},
		//To be changed in real-life solution, but never to be published
	'mailGun': {
			'hostname': 'api.mailgun.net', //us endpoint
			'domain': 'sandboxXXX.mailgun.org',
			'apiKey': 'd5aa21e653903c11cfc38c6a58471437-713d4f73-84ab0eb2', //unescape the chars?
			'senderMail': 'sandbox0d32ac152b8f468c9a4145814b6056a9.mailgun.org'
		}
};

// Determine wich envi was passed as a command line argument
var currentEnviroment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not default to stating
var enviromentToExport = typeof (enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

//Check that the current environment is one of the environments above, default is staging
config.env = typeof (enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

//Export the module
module.exports = config;

// Export 
module.exports = enviromentToExport;
