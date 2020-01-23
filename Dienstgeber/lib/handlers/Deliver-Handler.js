//Dependencies
var _data = require('../data');
var _tokens = require('./token-Handler');
var helpers = require('../helpers');
var config = require('../config');

//Private container
var _delivers = {};


// Deliver -  post
// optional: plz, stadt, straße, hausnummer;
_delivers.post = function (data,callback) {
    // Required
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() :  false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() :  false;
    var DeliverName = typeof(data.payload.DeliverName) == 'string' && data.payload.DeliverName.trim().length > 0 ? data.payload.DeliverName.trim() :  false;
    var Email = typeof(data.payload.Email) == 'string' && data.payload.Email.trim().length > 8 ? data.payload.Email.trim(): false;
    var age = typeof(data.payload.age) == 'string' && data.payload.age.trim().length > 0 ? data.payload.age.trim() :  false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() :  false;
    var personalnumber = typeof(data.payload.personalnumber) == 'string' && data.payload.personalnumber.trim().length > 0 ? data.payload.personalnumber.trim() :  false;

    // Optional
    var Deliver = typeof(data.payload.Deliver) == 'bool' && data.payload.Deliver == true ? true : false;
    var plz = typeof(data.payload.plz) == 'string' && data.payload.plz.trim().length > 4 ? data.payload.plz.trim(): false;
    var city = typeof(data.payload.city) == 'string' && data.payload.city.trim().length > 0 ? data.payload.city.trim() : false;
    var housenumber = typeof(data.payload.housenumber) == 'string' && data.payload.housenumber.trim().length > 0 ? data.payload.housenumber.trim() : false;
    var street = typeof(data.payload.street) == 'string' && data.payload.street.trim().length > 0 ? data.payload.street.trim() : false;

    console.log(firstName, lastName,DeliverName);
    if (firstName && lastName && DeliverName && Email && age && password) {
        // schauen dass der nutzer noch nicht existiert
        _data.read('delivers',DeliverName,function (err,data) {
            if (err) {
                // Hash Pw mit Crypto by NODE
                var HashedPassword = helpers.hash(password);

                if (HashedPassword) {
                    let personalnumber;
                    var deliverObject = {
                        'firstname' : firstName,
                        'lastname' : lastName,
                        'delivername' : DeliverName,
                        "Email" : Email,
                        'age' : age,
                        'hashedPassword' : HashedPassword,
                        'AGB' : true,
                        'Deliver' : Deliver,
                        'plz' : plz,
                        'city' : city,
                        'housenumber' : housenumber,
                        'street' : street,
                        'personalnumber' : personalnumber

                    };

                    // Store
                    _data.create('delivers', DeliverName, deliverObject, function (err) {
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
                // deliver aleready exist
                callback(400,{'Error' : 'Nutzer existiert bereits'});
            }
        });

    } else {
        console.log(firstName, lastName,DeliverName);
        callback(400,{'Error' : 'missing required fileds'});
    }
};

// Deliver -  get
_delivers.get = function (data,callback) {

    var DeliverName = typeof(data.queryStringObject.DeliverName) == 'string' && data.queryStringObject.DeliverName.trim().length > 0 ? data.queryStringObject.DeliverName.trim() : false;

    if (DeliverName) {

        // get token
       //   var tokens = typeof(data.headers.tokens) == 'string' ? data.headers.tokens : false; // Rechtschreibung !

      //  _tokens.verifyToken(tokens, DeliverName, function (tokenIsValid) {

        //    if (tokenIsValid) {
                _data.read('delivers',DeliverName,function (err,data) {
                    if (!err && data) {
                        delete data.hashedPassword; // nutzer muss sein hashed pw nicht wissen
                        callback(200, data);
                    } else {
                        callback(400);
                    };
                });
      //      } else {
      //          callback(403, {'error':'token is invalid'});
      //      }

    //   });
    } else {
        callback(400,{'Error' : 'Missing stuff'})
    }
};

// Deliver -  put
_delivers.put = function (data,callback) {
    var DeliverName = typeof(data.payload.DeliverName) == 'string' && data.payload.DeliverName.trim().length > 0 ? data.payload.DeliverName.trim() :  false;

    // Optional
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() :  false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() :  false;

    //Err if username is unvalid
    if (DeliverName) {
        if (firstName || lastName) {
    //        var token = typeof(data.headers.token) == 'string' ? data.headers.tokens : false;

            // Schaut ob Deliver Valid ist

     //       handels.tokens.verifyToken(token,DeliverName,function (tokenisValid) {
     //           if (tokenisValid) {
                    _data.read('delivers', DeliverName, function (err,DeliverData) {
                        if (!err && DeliverData) {
                            if (firstName) {
                                DeliverData.firstName = firstName;
                            }
                            if (lastName) {
                                DeliverData.lastName = lastName;
                            }
                            _data.update('delivers', DeliverName, DeliverData, function (err) {
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
      //          } else {
      //              callback(403, {'Error':'Some Error'});
      //          }
       //     });
        } else {
            callback(400, {'Error':'Missing update stuff_2'});
        }
    } else {
        callback(400,{'error':'Missing stuff_1'});
    }
};

// Deliver -  Del
_delivers.delete = function (data,callback) {

    var DeliverName = typeof(data.queryStringObject.DeliverName) == 'string' && data.queryStringObject.DeliverName.trim().length > 0 ? data.queryStringObject.DeliverName.trim() : false;

    if (DeliverName) {
    //    var token = typeof(data.headers.token) == 'string' ? data.headers.tokens : false;

     //   handels.tokens.verifyToken(token,DeliverName,function (tokenisValid) {
     //       if (tokenisValid) {
                _data.read('delivers',DeliverName,function (err,data) {
                    if (!err && data) {
                        _data.delete('delivers', DeliverName, function (err) {
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
       //     } else {
       //         callback(403, {'Error':'Look up Error403 on google pls'})
       //     }
      //  });
    } else {
        callback(400,{'Error' : 'Missing stuff'})
    }

};

module.exports = _delivers;