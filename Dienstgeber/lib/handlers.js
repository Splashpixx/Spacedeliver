
// <Dependencies>
var _data = require('./data');
var helpers = require('./helpers');
// </Dependencies>

//Handlers
var handlers = {};

// user (Kunde)
handlers.users = function (data,callback) {
	var acceptableMethodes = ['post','get','put','delete'];
	
	if (acceptableMethodes.indexOf(data.method) > -1) {
		handlers._users[data.method](data,callback);
	} else {
		callback(405); 
	}
};

// beinhaltet nutzer sub methoden
handlers._users = {};

// User -  post 
// User requirements: Vor/nachname, Nutzername, Alter, pw, agb, email;
// optional: plz, stadt, straße, hausnummer;
handlers._users.post = function (data,callback) {
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() :  false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() :  false;
	var UserName = typeof(data.payload.UserName) == 'string' && data.payload.UserName.trim().length > 0 ? data.payload.UserName.trim() :  false;
	var age = typeof(data.payload.age) == 'string' && data.payload.age.trim().length > 0 ? data.payload.age.trim() :  false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() :  false;
	var agb = typeof(data.payload.agb) == 'bool' && data.payload.agb == true ? true :  false;
	
	
	if (firstName && lastName && UserName && age && password) {
		// schauen dass der nutzer noch nicht existiert
		_data.read('user',UserName,function (err,data) {
			if (err) {
				// Hash Pw mit Crypto by NODE
				var HashedPassword = helpers.hash(password);
				
				if (HashedPassword) {
					var userObject = {
						'firstname' : firstName,
						'lastname' : lastName,
						'username' : UserName,
						'age' : age,
						'hashedPassword' : HashedPassword,
						'AGB' : true
					};
					
					// Store
					_data.create('users', UserName, userObject, function (err) {
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, {'Error' : 'could not create'});
						};
					});
				} else {
					callback(500, {'Error' : 'Could not do stuff'})
				}

			} else {
				// user aleready exist
				callback(400,{'Error' : 'Nutzer existiert bereits'});
			}
		});
		
	} else {
		callback(400,{'Error' : 'missing required fileds'});
	}
};

// User -  get
// @TODO User mus sich authentivizieren 
handlers._users.get = function (data,callback) {
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() : false;
	
	if (UserName) {
		_data.read('users',UserName,function (err,data) {
			if (!err && data) {
				delete data.hashedPassword; // nutzer muss sein hashed pw nicht wissen
				callback(200, data);
			} else {
				callback(400);
			};
		});
	} else {
		callback(400,{'Error' : 'Missing stuff'})
	}
};

// User -  put
handlers._users.put = function (data,callback) {
	var UserName = typeof(data.payload.UserName) == 'string' && data.payload.UserName.trim().length > 0 ? data.payload.UserName.trim() :  false;
	
	// Optional
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() :  false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() :  false;
	
	//Err if username is unvalid
	if (UserName) {
		if (firstName || lastName) {
			_data.read('users', UserName, function (err,UserData) {
				if (!err && UserData) {
					if (firstName) {
						UserData.firstName = firstName;
					}
					if (lastName) {
						UserData.lastName = lastName;
					}
					_data.update('users', UserName, UserData, function (err) {
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, {'Error':'Idk whats wrong'});
						}
					});
				}else {
					callback(400, {'Error':'User dose not exist'});
				}
			});
		} else {
			callback(400, {'Error':'Missing update stuff_2'});
		}
	} else {
		callback(400,{'error':'Missing stuff_1'});
	}

};

// User -  Del
// @TODO User mus sich authentivizieren 
handlers._users.delete = function (data,callback) {
	
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() : false;
	
	if (UserName) {
		_data.read('users',UserName,function (err,data) {
			if (!err && data) {
				_data.delete('users', UserName, function (err) {
					if (!err) {
						callback(200);
					} else {
						callback(500, {'error':'Problems !'})
					}
				});
			} else {
				callback(400);
			};
		});
	} else {
		callback(400,{'Error' : 'Missing stuff'})
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
