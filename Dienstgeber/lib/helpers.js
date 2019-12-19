
// <Dependencies>
var crypto = require('crypto');
var config = require('./config');
// </Dependencies>

// Container für Helpers
var helpers = {};

// Create a. SHA256 hash
helpers.hash = function (str) {
	if (typeof(str) == 'string' && str.length > 0) {
		var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return 0
	}
};

// Parse Json sting to object in all cases without trowing 
helpers.parseJsonToObject = function (str) {
	try{
		var obj = JSON.parse(str);
		return obj;
	}catch(e){
		return {};
	}
};


//Export
module.exports = helpers