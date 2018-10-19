console.log('users.js from model');

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');   // to hash password

//mongoose.connect('mongodb://localhost/login',{useNewUrlParser:true});
//var db = mongoose.connection;

// User schema

var userSchema = mongoose.Schema({
    email:{
        type : String,
        createIndex : true
    },
    password:{
        type : String
    },
    name:{
        type : String
    }
});

//  variable to accept outside this file

var User = module.exports = mongoose.model('User',userSchema); // exporting model

// create user function
module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // hash the password before storing
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Functions for Querying user data and authenticating

module.exports.getUserByEmail = function (username,callback) {
    var query = {email : username};
    User.findOne(query,callback);
    console.log('email : ' + User.email);
    console.log('name : ' + User.name);
}

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback);
}

module.exports.verifyPassword = function (candidatePassword,hash,callback) {
    bcrypt.compare(candidatePassword,hash,function (err,isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}