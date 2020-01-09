
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

helpers.createRandomString = function (strLength) {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
	
	if (strLength) {
		var possibleChar = 'abcdefghijklmnopqrstivwxyz1234567890';
		
		var str = '';
		
		for (i = 1; i<= strLength; i++) {
			var randomeChar =possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
			
			str+=randomeChar;
		}
		
		return str;
	} else {
		return false;
	}
};


//Export
module.exports = helpers


