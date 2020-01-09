/*
INDEX
USER: 28 - 202
Token: 207 - 349
Items : 351 - 500
*/

// <Dependencies>
var _data = require('./data');
var helpers = require('./helpers');
var fs = require('fs');
var path = require('path');
var itemFolder = './.data/item'

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
// optional: plz, stadt, straße, hausnummer;
handlers._users.post = function (data,callback) {
	// Required
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() :  false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() :  false;
	var UserName = typeof(data.payload.UserName) == 'string' && data.payload.UserName.trim().length > 0 ? data.payload.UserName.trim() :  false;
	var Email = typeof(data.payload.Email) == 'string' && data.payload.Email.trim().length > 8 ? data.payload.Email.trim(): false;
	var age = typeof(data.payload.age) == 'string' && data.payload.age.trim().length > 0 ? data.payload.age.trim() :  false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() :  false;
	
	// Optional
	var Deliver = typeof(data.payload.Deliver) == 'bool' && data.payload.Deliver == true ? true : false;
	var plz = typeof(data.payload.plz) == 'string' && data.payload.plz.trim().length > 4 ? data.payload.plz.trim(): false;
	var city = typeof(data.payload.city) == 'string' && data.payload.city.trim().length > 0 ? data.payload.city.trim() : false;
	var housenumber = typeof(data.payload.housenumber) == 'string' && data.payload.housenumber.trim().length > 0 ? data.payload.housenumber.trim() : false;
	var street = typeof(data.payload.street) == 'string' && data.payload.street.trim().length > 0 ? data.payload.street.trim() : false;
	
	
	if (firstName && lastName && UserName && Email && age && password) {
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
						"Email" : Email,
						'age' : age,
						'hashedPassword' : HashedPassword,
						'AGB' : true,
						'Deliver' : Deliver,
						'plz' : plz,
						'city' : city,
						'housenumber' : housenumber,
						'street' : street,
						
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
handlers._users.get = function (data,callback) {
	
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() : false;
	
	if (UserName) {
		
		// get token 
		var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false; // Rechtschreibung !

		handlers._tokens.verifyToken(tokens, UserName, function (tokenIsValid) {
			
			if (tokenIsValid) {
				_data.read('users',UserName,function (err,data) {
					if (!err && data) {
						delete data.hashedPassword; // nutzer muss sein hashed pw nicht wissen
						callback(200, data);
					} else {
						callback(400);
					};
				});
			} else {
				callback(403, {'error':'token is invalid'});
			}
			
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
			var token = typeof(data.headers.token) == 'string' ? data.headers.tokens : false;

			// Schaut ob User Valid ist

			handels.tokens.verifyToken(token,UserName,function (tokenisValid) {
				if (tokenisValid) {
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
					callback(403, {'Error':'Some Error'});
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
handlers._users.delete = function (data,callback) {
	
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() : false;
	
	if (UserName) {
		var token = typeof(data.headers.token) == 'string' ? data.headers.tokens : false;
		
		handels.tokens.verifyToken(token,UserName,function (tokenisValid) {
			if (tokenisValid) {
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
				callback(403, {'Error':'Look up Error403 on google pls'})
			}
		});
	} else {
		callback(400,{'Error' : 'Missing stuff'})
	}
	
};



//Tokens
handlers.tokens = function (data,callback) {
	var acceptableMethodes = ['post','get','put','delete'];
	
	if (acceptableMethodes.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data,callback);
	} else {
		callback(405); 
	}
};


//container
handlers._tokens = {};

//Post
// Required data: Username, Password
handlers._tokens.post = function (data,callback) {
	
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
handlers._tokens.get = function (data,callback) {
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
handlers._tokens.put = function (data,callback) {
	
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
handlers._tokens.delete = function (data,callback) {
		
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
handlers._tokens.verifyToken = function (id, UserName, Callback) {
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


//items == Produkte -> sachen die man kaufen kann.
handlers.item = function (data,callback) {
	var acceptableMethodes = ['post','get','put','delete'];
	
	if (acceptableMethodes.indexOf(data.method) > -1) {
		handlers._item[data.method](data,callback);
	} else {
		callback(405); 
	}
};

handlers._item = {};

//Get
handlers._item.get = function (data,callback) {
	
	var itemID = typeof(data.queryStringObject.itemID) == 'string' && data.queryStringObject.itemID.trim().length > 0 ? data.queryStringObject.itemID.trim() : false;
		if (itemID) { 
					_data.read('itmes',itemID,function (err,data) {
						if (!err && data) {
							callback(200, data);
						} else {
							callback(400);
						};
					});
		} else {
			callback(400,{'Error' : 'Missing stuff'})
		}
};

//Put
handlers._item.put = function (data,callback) {
	
		var itemID = typeof(data.payload.itemID) == 'string' && data.payload.itemID.trim().length > 0 ? data.payload.itemID.trim() :  false;
		
		// Optional
		var price = typeof(data.payload.price) == 'string' && data.payload.price.tirm().length > 0 ? data.payload.price.trim(): false;
		var weight = typeof(data.payload.weight) == 'string' && data.payload.weight.tirm().length > 0 ? data.payload.weight.trim(): false;
		var ammount = typeof(data.payload.ammount) == 'string' && data.payload.ammount.tirm().length > 0 ? data.payload.ammount.trim(): false;
		var itemName = typeof(data.payload.itemName) == 'string' && data.payload.itemName.trim().length > 0 ? data.payload.itemName.trim() :  false;
				
		//Err if username is unvalid
		if (UserName) {
			if (price || weight || ammount || itemName) {
				
						_data.read('items', itemID, function (err,ItemData) {
							if (!err && ItemData) {
								if (price) {
									ItemData.price = price;
								} // ItemData = Userdata ?!
								if (weight) {
									ItemData.weight = weight;
								}
								if (ammount) {
									ItemData.ammount = ammount;
								}
								if (itemName) {
									ItemData.itemName = itemName;
								}
								
								_data.update('items', itemID, ItemData, function (err) {
									if (!err) {
										callback(200);
									} else {
										console.log(err);
										callback(500, {'Error':'Idk whats wrong'});
									}
								});
							}else {
								callback(400, {'Error':'Item dose not exist'});
							}
						});
					
			} else {
				callback(400, {'Error':'Missing update stuff_2'});
			}
		} else {
			callback(400,{'error':'Missing stuff_1'});
		}
};

//Post
handlers._item.post = function (data,callback) {
		
		let itemID = typeof(data.payload.itemID) == 'string' && data.payload.itemID.trim().length > 0 ? data.payload.itemID.trim() :  false;
		let itemName = typeof(data.payload.itemName) == 'string' && data.payload.itemName.trim().length > 0 ? data.payload.itemName.trim() :  false;
		let art = typeof(data.payload.art) == 'string' && data.payload.art.trim().length > 0 ? data.payload.art.trim() :  false;
		let price = typeof(data.payload.price) == 'string' && data.payload.price.trim().length > 0 ? data.payload.price.trim(): false;
		let weight = typeof(data.payload.weight) == 'string' && data.payload.weight.trim().length > 0 ? data.payload.weight.trim(): false;
		
		if (itemID && itemName && art && price && weight) {
			// schauen dass der nutzer noch nicht existiert
			_data.read('item',itemID,function (err,data) {
				if (err) {
					if (itemID) {
						var itemObject = {
							'itemID' : itemID,
							'itemName' : itemName,
							'art' : art,
							'price' : price,
							'weight' : weight,
						};
						
						// Store
						_data.create('item', itemID, itemObject, function (err) {
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
					callback(400,{'Error' : 'Item existiert bereits'});
				}
			});
		} else {
			callback(400,{'Error' : 'missing required fileds - THIS'});
		}
};

//Del
handlers._item.delete = function (data,callback) {
	
	var itemID = typeof(data.queryStringObject.itemID) == 'string' && data.queryStringObject.itemID.trim().length > 0 ? data.queryStringObject.itemID.trim() : false;
		// was zum f... 
		if (itemID) {
			_data.read('users',UserName,function (err,data) {
				if (!err && data) {
					_data.delete('items', itemID, function (err) {
						if (!err) {
							callback(200);
						} else {
							callback(500, {'error':'fataler Error !'})
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


// Menu Items
handlers.menuitems = function(data, callback) {
	var acceptableMethods = ['get'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._menuitems[data.method](data, callback);
	} else {
		callback(405);
	}
}

// Container for all the menu items methods
handlers._menuitems = {};

// 
handlers._menuitems.get = function(data, callback) {
	
	// Check that the Username is valid
	var UserName = typeof(data.queryStringObject.UserName) == 'string' && data.queryStringObject.UserName.trim().length > 0 ? data.queryStringObject.UserName.trim() : false;

	if (UserName) {
		var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false;
		handlers._tokens.verifyToken(tokens, UserName, function (tokenIsValid) {
			
			if (tokenIsValid) {
				_data.read('users',UserName,function (err,data) {
					if (!err && data) {
						callback(200);
						
						fs.readdir(itemFolder, (err, files) => {
							files.forEach(file => {
								try {
									const data = fs.readFileSync(itemFolder+'/'+file, 'utf8');
									console.log(data);
								} catch (err) {
									console.error(err);
								}
							});
						});
					} else {
						callback(403);
					};
				});
			} else {
				callback(403, {'error':'token is invalid'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required field.- this'});
		console.log(UserName,data);
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


// Mein coding Stuff