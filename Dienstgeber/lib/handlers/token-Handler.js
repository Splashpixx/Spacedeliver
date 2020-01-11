

//Dependencies
var _data = require('../data');
var helpers = require('../helpers');
var config = require('../config');



//container
var _tokens = {};

//Post
// Required data: Username, Password
_tokens.post = function (data,callback) {
	
	var UserName = typeof(data.payload.UserName) == 'string' && data.payload.UserName.trim().length > 0 ? data.payload.UserName.trim() :  false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() :  false;
	
	if (UserName && password) {
		// such nach den user dem das passwort gehört/bei dem das halt passt
		_data.read('users',UserName,function (err,userData) {
			if (!err && userData) {
				//hash the PW
				var hashedPasswort = helpers.hash(password);
				if (hashedPasswort == userData.hashedPassword) {
					
					var tokenID = helpers.createRandomString(20);
					var expires = Date.now() + 1000 * 60 * 60;
					var tokenObject = {
						'UserName' : UserName,
						'id' :  tokenID,
						'expires' : expires
					};
					
					//Store Token
					_data.create('tokens', tokenID, tokenObject, function (err) {
						
						if (!err) {
							callback(200, tokenObject);
						} else {
							callback(500, {'Error' : 'we have a unknown Problem'});
						};
					});
				} else {
					callback(400, {'Error' : 'Wrong Password'});
				}
			} else {
				callback(400, {'Err' : 'Something went wrong'});
			}
		});
	} else {
		callback(400,{'Error' : 'Missing required fild(s)'});
	}
}

//get
//Required
_tokens.get = function (data,callback) {
	var ID = typeof(data.queryStringObject.ID) == 'string' && data.queryStringObject.ID.trim().length == 20 ? data.queryStringObject.ID.trim() : false;
	
	if (ID) {
		_data.read('tokens',ID,function (err,tokenData) {
			if (!err && tokenData) {
				callback(200, data);
			} else {
				callback(404);
			};
		});
	} else {
		callback(400,{'Error' : 'Missing stuff'})
	}
}

//put
// Required: ID && extend
_tokens.put = function (data,callback) {
	
	var ID = typeof(data.payload.ID) == 'string' && data.payload.ID.trim().length == 20 ? data.payload.ID.trim() : false;
	var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
	
	if (ID && extend) {
		_data.read('tokens',ID,function (err,tokenData) {
			if (!err && tokenData) {
				if (tokenData.expires > Date.now()) {
					tokenData.expires = Date.now() + 1000 * 60 * 60;
					_data.update('tokens', ID, tokenData, function (err) {
						if (!err) {
							callback(200);
						} else {
							callback(500, {'Error':'Could not update the Stuff you want'});
						}
					});
				} else {
					callback(400, {'Error':'Token data expand'});
				}
			} else {
				callback(400, {'Error':'Token. dos not exist'});
			}
		})
	} else {
		callback(400,{'Error':'Missing required filds'});
	}
}

//del
_tokens.delete = function (data,callback) {
		
		var ID = typeof(data.queryStringObject.ID) == 'string' && data.queryStringObject.ID.trim().length == 20 ? data.queryStringObject.ID.trim() : false;		
		if (ID) {
			_data.read('tokens',ID,function (err,data) {
				if (!err && data) {
					_data.delete('tokens', ID, function (err) {
						if (!err) {
							callback(200);
						} else {
							callback(500, {'error':'Problems !'});
						}
					});
				} else {
					callback(400);
				};
			});
		} else {
			callback(400,{'Error' : 'Missing stuff'});
		}
};

//Verify the User by tokenID
_tokens.verifyToken = function (id, UserName, Callback) {
	_data.read('tokens', id, function (err,tokenData) {
		if (!err && tokenData) {
			if (tokenData.UserName == UserName && tokenData.expires > Date.now() ) {
				Callback(true);
			} else {
				Callback(false);
			}
		} else {
			Callback(false);
			console.log(tokenData, id, UserName);
		}
	});	
};

module.exports = _tokens;