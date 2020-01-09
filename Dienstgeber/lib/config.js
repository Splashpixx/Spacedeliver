/*
Create and export config var's
*/

// container for all enviroments
var enviroments = {};

// Staging (default) enviroment
enviroments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
	'hashingSecret' : 'thisIsASecret'
};

// Production enviroment
enviroments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret' : 'thisIsASecret'
};

// Determine wich envi was passed as a command line argument
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not default to stating
var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;


// Export 
module.exports = enviromentToExport;

//in die env. kommen die benutzen API's
// Also MailGun, Stripe, Mastercard...