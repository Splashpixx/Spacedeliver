
// <Dependencies>
var fs =  require('fs');
var path = require('path');
var helpers = require('./helpers');
// </Dependencies>

// container
var lib ={};

// Base dir
lib.baseDir = path.join(__dirname,'/../.data/');

//CRUD Stuff !

//Create
lib.create = function (dir,file,data,callback) {
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function (err,fileDescriptor) {
		if(!err && fileDescriptor){
			// wandelt input in string um
			var stringData = JSON.stringify(data);
			
			// schreib zeug in die JSON dat. und schließt es danach
			fs.writeFile(fileDescriptor, stringData,function (err) {
				if(!err){
					fs.close(fileDescriptor, function (err) {
						if(!err){
							callback(false);
						} else {
							callback('Error closing new file');
						}
					});
				} else {
					callback('Error writing to new File');
				}
			});
		} else {
			callback('Could not create new file, it may already exist');
		}
	});
	
};

// Read
lib.read = function (dir,file,callback) {
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function (err,data) {
		if (!err && data) {
			var parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err,data);

		}
	});
};

// Update 
lib.update = function (dir,file,data,callback) {
	// open file
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function (err,fileDescriptor) {
		if (!err && fileDescriptor) {
			// Data to sting
			var stringData = JSON.stringify(data);
			
			// Truncate the file
			fs.ftruncate(fileDescriptor,function (err) {
				if (!err) {
					//
					fs.writeFile(fileDescriptor, stringData, function (err) {
						if (!err) {
							fs.close(fileDescriptor, function (err) {
								if (!err) {
									callback(false);
								} else {
									callback('Err closing the file');
								}
							});
						} else {
							callback("Error writing to file");
						}
					});
				} else {
					callback("err tuncating file");
				}
			});
			
			
		} else {
			callback('Could not open the file, may not exist');
		}
	});
};

// Del
lib.delete = function (dir,file,callback) {
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function (err) {
		if (!err) {
			callback(false);
		} else {
			callback('Error Deleating file');
		}
	});
};


//list
lib.list = function (dir,callback) {
	fs.readdir(lib.baseDir+'dir'+'/',function (err,data) {
		if (!err && data && data.lenght > 0) {
			var trimmedFileName = [];
			data.forEach(function (fileName) {
				trimmedFileName.push(fileName.replace('.json',''));
			});
			callback(false,trimmedFileName);
		} else {
			callback(err, data);
		}
	});
};

lib.listContaining = function(dir, containsFileName, callback){

	fs.readdir(lib.baseDir + dir + '/', function(err, data){
		if (!err && data && data.length > 0) {
			var trimmedFileNames = [];
			data.forEach(function(fileName){
				if (fileName.includes(containsFileName))
					trimmedFileNames.push(fileName.replace('.json',''));
			});
			callback(false, trimmedFileNames);
		} else {
			callback(err, data);
		}
	});
};

// Export
module.exports = lib;