
// <Dependencies>
var crypto = require('crypto');
var config = require('./config');
const mailgun = require("mailgun-js");
const querystring = require('querystring');
var fs = require('fs');
var path = require('path');


// </Dependencies>

// Container für Helpers
var helpers = {};

helpers.baseDir = path.join(__dirname);

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
			var randomeChar = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
			
			str+=randomeChar;
		}
		
		return str;
	} else {
		return false;
	}
};

helpers.orderName = function (orderId, person) {
	return `order_${orderId}_for_${person}`;
}

helpers.lookIfeverythingIsallRight = function (orderArray) {
	
	var lookGrammar = helpers.grammar(orderArray, ["id"]);
	if (!lookGrammar) {
		return false;
	}
	
	
	//step 3. schau ob die gegebenen id's in der Json Existieren ()
	var hand = helpers.getStuff();

	orderArray.forEach(function (element) {
		
		/* .some überprüft einen Array (hand) und schaut ob mindestens ein Element den übergebenen kriterien entspricht */
		if (!hand.some(order => order.Id == element.id)) {
			orderArray = false;
			return;
		}
	});
	
	return orderArray;
}


helpers.grammar = function (input, requiriedFields = []) {
	
	// step 1. Schau ob der Input ein Array ist
	var ArrayisValid = helpers.ValidArray(input);
	if (!ArrayisValid) {
		return false
	}
	
	//step 2. schau ob die elemente alle "required filds" besitzen (dat moment wenn. man deutsch verlernt)
	
	input.forEach(function (element) {
			var elementisValid = helpers.haveAllProperties(element, requiriedFields);
			
			if (!elementisValid) {
				return false;
			}
		});
		
		return input;
}

helpers.ValidArray = function (input) {
	return typeof(input) == 'object' && input instanceof Array && input.length > 0 ? input : false;
}

helpers.haveAllProperties = function(element, fields) {
	
	if (fields == 'undefined' || fields == null)
		return false;
	
	fields.forEach(function(field) {
		
		// hasOwnProperty  = gibt einen boolean Wert zurück abhängig von der Existenz des gegebenen Attributs (field)in einem Objekt (element). wir schauen hier ob das Attribut (field) in dem objekt (element) existent ist.
		if (!element.hasOwnProperty(field))
			return false; 
	});
	return true;
};

helpers.getStuff = function () {
	
//	 is halt sync
	var texscht = fs.readFileSync(helpers.baseDir+'/'+'my'+'.json', 'utf8');
	return JSON.parse(texscht);
	
	//Test
//	fs.readFile(helpers.baseDir+'/'+'my'+'.json', 'utf8', function (err, data) {
//		return data;
//		
//	});
}

//Export
module.exports = helpers


/* Unterschied zwischen readfileSync und readFile : 
	readFileSync() is synchronous and blocks execution until finished. 
	These return their results as return values. readFile() are asynchronous and return immediately while they function in the background.
	You pass a callback function which gets called when they finish. 
	-Stackoverflow
	
	you should NEVER call readFileSync in a node express/webserver since it will tie up the single thread loop while I/O is performed. 
	You want the node loop to process other requests until the I/O completes and your callback handling code can run
	-Stackoverflow User
	
*/